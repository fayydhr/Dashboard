import sql from "@/app/api/utils/sql";

// GET /api/dashboard/stats - Get dashboard statistics
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const wilayah = searchParams.get("wilayah");
    const periode = searchParams.get("periode") || "6months";

    // Calculate date range based on periode
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11
    const currentYear = currentDate.getFullYear();

    let monthsBack = 6;
    if (periode === "3months") monthsBack = 3;
    if (periode === "1year") monthsBack = 12;

    // Build base query conditions
    let whereClause = "";
    const params = [];
    let paramCount = 0;

    if (wilayah && wilayah !== "all") {
      paramCount++;
      whereClause = ` AND f.wilayah = $${paramCount}`;
      params.push(wilayah);
    }

    // Get total faskes
    const totalFaskesResult = await sql(
      `
      SELECT COUNT(*) as count 
      FROM faskes f 
      WHERE 1=1 ${whereClause}
    `,
      params,
    );

    // Get current month average achievement
    const avgAchievementResult = await sql(
      `
      SELECT AVG(c.pencapaian_target) as avg_achievement
      FROM capaian c 
      JOIN faskes f ON c.faskes_id = f.faskes_id
      WHERE c.bulan = ${currentMonth} AND c.tahun = ${currentYear} ${whereClause}
    `,
      params,
    );

    // Get next month prediction average
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;

    const avgPredictionResult = await sql(
      `
      SELECT AVG(p.prediksi_pencapaian) as avg_prediction
      FROM prediksi p 
      JOIN faskes f ON p.faskes_id = f.faskes_id
      WHERE p.bulan = ${nextMonth} AND p.tahun = ${nextYear} ${whereClause}
    `,
      params,
    );

    // Get faskes at risk (predicted achievement < target)
    const riskFaskesResult = await sql(
      `
      SELECT COUNT(*) as count
      FROM prediksi p 
      JOIN faskes f ON p.faskes_id = f.faskes_id
      JOIN capaian c ON p.faskes_id = c.faskes_id 
      WHERE p.bulan = ${nextMonth} AND p.tahun = ${nextYear}
        AND c.bulan = ${currentMonth} AND c.tahun = ${currentYear}
        AND p.prediksi_pencapaian < c.target ${whereClause}
    `,
      params,
    );

    // Calculate previous month for delta comparison
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const prevAvgAchievementResult = await sql(
      `
      SELECT AVG(c.pencapaian_target) as avg_achievement
      FROM capaian c 
      JOIN faskes f ON c.faskes_id = f.faskes_id
      WHERE c.bulan = ${prevMonth} AND c.tahun = ${prevYear} ${whereClause}
    `,
      params,
    );

    // Calculate deltas
    const currentAvg = parseFloat(
      avgAchievementResult[0]?.avg_achievement || 0,
    );
    const prevAvg = parseFloat(
      prevAvgAchievementResult[0]?.avg_achievement || 0,
    );
    const achievementDelta = currentAvg - prevAvg;

    const avgPrediction = parseFloat(
      avgPredictionResult[0]?.avg_prediction || 0,
    );
    const predictionDelta = avgPrediction - currentAvg;

    return Response.json({
      success: true,
      data: {
        totalFaskes: {
          value: parseInt(totalFaskesResult[0].count),
          delta: "+12", // This would need historical data for accurate calculation
          trend: "up",
        },
        avgAchievement: {
          value: `${currentAvg.toFixed(1)}%`,
          delta: `${achievementDelta >= 0 ? "+" : ""}${achievementDelta.toFixed(1)}%`,
          trend: achievementDelta >= 0 ? "up" : "down",
        },
        avgPrediction: {
          value: `${avgPrediction.toFixed(1)}%`,
          delta: `${predictionDelta >= 0 ? "+" : ""}${predictionDelta.toFixed(1)}%`,
          trend: predictionDelta >= 0 ? "up" : "down",
        },
        riskFaskes: {
          value: parseInt(riskFaskesResult[0].count),
          delta: "-5", // This would need historical data for accurate calculation
          trend: "up", // up is good for risk reduction
        },
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return Response.json(
      { success: false, error: "Failed to fetch dashboard statistics" },
      { status: 500 },
    );
  }
}
