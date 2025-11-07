import sql from "@/app/api/utils/sql";

// GET /api/faskes - List all faskes with optional filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const wilayah = searchParams.get("wilayah");
    const jenis_faskes = searchParams.get("jenis_faskes");
    const search = searchParams.get("search");

    let query = "SELECT * FROM faskes WHERE 1=1";
    const params = [];
    let paramCount = 0;

    if (wilayah && wilayah !== "all") {
      paramCount++;
      query += ` AND LOWER(wilayah) = LOWER($${paramCount})`;
      params.push(wilayah);
    }

    if (jenis_faskes) {
      paramCount++;
      query += ` AND jenis_faskes = $${paramCount}`;
      params.push(jenis_faskes);
    }

    if (search) {
      paramCount++;
      query += ` AND (LOWER(name) LIKE LOWER($${paramCount}) OR LOWER(kode) LIKE LOWER($${paramCount}))`;
      params.push(`%${search}%`);
    }

    query += " ORDER BY name ASC";

    const faskesList = await sql(query, params);

    return Response.json({
      success: true,
      data: faskesList,
      count: faskesList.length,
    });
  } catch (error) {
    console.error("Error fetching faskes:", error);
    return Response.json(
      { success: false, error: "Failed to fetch faskes data" },
      { status: 500 },
    );
  }
}

// POST /api/faskes - Create new faskes
export async function POST(request) {
  try {
    const { faskes_id, name, kode, wilayah, jenis_faskes, alamat } =
      await request.json();

    if (!faskes_id || !name || !kode || !wilayah) {
      return Response.json(
        {
          success: false,
          error: "Missing required fields: faskes_id, name, kode, wilayah",
        },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO faskes (faskes_id, name, kode, wilayah, jenis_faskes, alamat)
      VALUES (${faskes_id}, ${name}, ${kode}, ${wilayah}, ${jenis_faskes || "rumah_sakit"}, ${alamat || ""})
      RETURNING *
    `;

    return Response.json({
      success: true,
      data: result[0],
      message: "Faskes created successfully",
    });
  } catch (error) {
    console.error("Error creating faskes:", error);
    if (error.code === "23505") {
      // Unique constraint violation
      return Response.json(
        { success: false, error: "Faskes ID atau kode sudah ada" },
        { status: 409 },
      );
    }
    return Response.json(
      { success: false, error: "Failed to create faskes" },
      { status: 500 },
    );
  }
}
