import sql from "@/app/api/utils/sql";

// GET /api/dashboard/performance - Get performance trend data for charts
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const wilayah = searchParams.get("wilayah");
    const periode = searchParams.get("periode") || "6months";

    // Calculate date range based on periode
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
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

    // Get monthly performance data including predictions
    const performanceData = await sql(
      `
      WITH monthly_data AS (
        -- Historical achievements
        SELECT 
          c.bulan,
          c.tahun,
          AVG(c.pencapaian_target) as achievement,
          AVG(c.target) as target,
          NULL as prediction,
          'historical' as data_type
        FROM capaian c 
        JOIN faskes f ON c.faskes_id = f.faskes_id
        WHERE 1=1 ${whereClause}
        GROUP BY c.bulan, c.tahun
        
        UNION ALL
        
        -- Future predictions
        SELECT 
          p.bulan,
          p.tahun,
          NULL as achievement,
          85.0 as target, -- Default target
          AVG(p.prediksi_pencapaian) as prediction,
          'prediction' as data_type
        FROM prediksi p 
        JOIN faskes f ON p.faskes_id = f.faskes_id
        WHERE 1=1 ${whereClause}
        GROUP BY p.bulan, p.tahun
      )
      SELECT 
        bulan,
        tahun,
        MAX(achievement) as achievement,
        MAX(target) as target,
        MAX(prediction) as prediction
      FROM monthly_data
      GROUP BY bulan, tahun
      ORDER BY tahun, bulan
    `,
      params,
    );

    // Transform data for chart format
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const chartData = performanceData.map((row) => ({
      month: monthNames[row.bulan - 1],
      target: parseFloat(row.target || 85),
      achieved: row.achievement ? parseFloat(row.achievement) : null,
      predicted: row.prediction ? parseFloat(row.prediction) : null,
    }));

    // Get regional distribution data
    const regionData = await sql(`
      SELECT 
        f.wilayah,
        COUNT(*) as count,
        COUNT(*) * 100.0 / (SELECT COUNT(*) FROM faskes) as percentage
      FROM faskes f 
      GROUP BY f.wilayah
      ORDER BY count DESC
    `);

    const regionChartData = regionData.map((region, index) => ({
      name: region.wilayah,
      value: Math.round(parseFloat(region.percentage)),
      color:
        ["#1D4ED8", "#6366F1", "#8B5CF6", "#06B6D4", "#10B981"][index] ||
        "#6B7280",
    }));

    return Response.json({
      success: true,
      data: {
        performanceTrend: chartData,
        regionDistribution: regionChartData,
      },
    });
  } catch (error) {
    console.error("Error fetching performance data:", error);
    return Response.json(
      { success: false, error: "Failed to fetch performance data" },
      { status: 500 },
    );
  }
}
