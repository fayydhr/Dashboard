import sql from "@/app/api/utils/sql";

// GET /api/dashboard/ranking - Get faskes ranking and recommendations
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const wilayah = searchParams.get("wilayah");
    const limit = parseInt(searchParams.get("limit")) || 5;

    // Build base query conditions
    let whereClause = "";
    const params = [];
    let paramCount = 0;

    if (wilayah && wilayah !== "all") {
      paramCount++;
      whereClause = ` AND f.wilayah = $${paramCount}`;
      params.push(wilayah);
    }

    // Get current date
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;

    // Get faskes ranking based on current achievement
    const rankingQuery = `
      SELECT 
        f.faskes_id,
        f.name,
        f.wilayah,
        c.pencapaian_target as achievement,
        COALESCE(p.prediksi_pencapaian, c.pencapaian_target) as prediction,
        CASE 
          WHEN c.pencapaian_target >= 95 THEN 'excellent'
          WHEN c.pencapaian_target >= 90 THEN 'good'
          WHEN c.pencapaian_target >= 80 THEN 'warning'
          ELSE 'poor'
        END as status,
        ROW_NUMBER() OVER (ORDER BY c.pencapaian_target DESC) as rank
      FROM faskes f
      LEFT JOIN capaian c ON f.faskes_id = c.faskes_id 
        AND c.bulan = $${paramCount + 1} AND c.tahun = $${paramCount + 2}
      LEFT JOIN prediksi p ON f.faskes_id = p.faskes_id 
        AND p.bulan = $${paramCount + 3} AND p.tahun = $${paramCount + 4}
      WHERE 1=1 ${whereClause}
      ORDER BY c.pencapaian_target DESC NULLS LAST
      LIMIT $${paramCount + 5}
    `;

    const rankingParams = [
      ...params,
      currentMonth,
      currentYear,
      nextMonth,
      nextYear,
      limit,
    ];
    const rankingData = await sql(rankingQuery, rankingParams);

    // Format ranking data
    const formattedRanking = rankingData.map((row) => ({
      rank: parseInt(row.rank),
      name: row.name,
      faskes_id: row.faskes_id,
      achievement: parseFloat(row.achievement || 0),
      prediction: parseFloat(row.prediction || 0),
      status: row.status,
      wilayah: row.wilayah,
    }));

    // Get active recommendations
    const recomQuery = `
      SELECT 
        r.id,
        r.faskes_id,
        f.name as faskes,
        r.tindakan_disarankan as action,
        r.alasan as message,
        r.risk_level as risk,
        r.status,
        r.bulan,
        r.tahun
      FROM rekomendasi r
      JOIN faskes f ON r.faskes_id = f.faskes_id
      WHERE r.status = 'active' ${whereClause}
      ORDER BY 
        CASE r.risk_level 
          WHEN 'high' THEN 1 
          WHEN 'medium' THEN 2 
          WHEN 'low' THEN 3 
        END,
        r.created_at DESC
      LIMIT 10
    `;

    const recommendationsData = await sql(recomQuery, params);

    // Format recommendations data
    const formattedRecommendations = recommendationsData.map((row) => ({
      id: row.id,
      faskes: row.faskes,
      faskes_id: row.faskes_id,
      risk: row.risk_level,
      message: row.alasan,
      action: row.tindakan_disarankan,
      status: row.status,
      period: `${row.bulan}/${row.tahun}`,
    }));

    return Response.json({
      success: true,
      data: {
        ranking: formattedRanking,
        recommendations: formattedRecommendations,
      },
    });
  } catch (error) {
    console.error("Error fetching ranking data:", error);
    return Response.json(
      { success: false, error: "Failed to fetch ranking and recommendations" },
      { status: 500 },
    );
  }
}
