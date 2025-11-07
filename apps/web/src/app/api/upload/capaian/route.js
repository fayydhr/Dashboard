import sql from "@/app/api/utils/sql";

// POST /api/upload/capaian - Process uploaded Excel file for faskes achievement data
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const bulan = parseInt(formData.get("bulan"));
    const tahun = parseInt(formData.get("tahun"));
    const uploadedBy = formData.get("uploadedBy") || "admin";

    if (!file) {
      return Response.json(
        { success: false, error: "No file provided" },
        { status: 400 },
      );
    }

    if (!bulan || !tahun) {
      return Response.json(
        { success: false, error: "Bulan dan tahun harus disediakan" },
        { status: 400 },
      );
    }

    // Create upload history record
    const uploadRecord = await sql`
      INSERT INTO upload_history (filename, file_size, upload_status, bulan, tahun, uploaded_by)
      VALUES (${file.name}, ${file.size}, 'processing', ${bulan}, ${tahun}, ${uploadedBy})
      RETURNING id
    `;

    const uploadId = uploadRecord[0].id;

    try {
      // For demo purposes, we'll simulate processing Excel data
      // In a real implementation, you would use libraries like xlsx or exceljs to parse the file

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock data that would come from Excel file
      const mockExcelData = [
        {
          faskes_id: "FSK001",
          kunjungan: 2800,
          rujukan: 390,
          rujukan_tidak_tepat: 25,
          pencapaian_target: 95.5,
        },
        {
          faskes_id: "FSK002",
          kunjungan: 2400,
          rujukan: 300,
          rujukan_tidak_tepat: 30,
          pencapaian_target: 93.2,
        },
        {
          faskes_id: "FSK003",
          kunjungan: 2150,
          rujukan: 270,
          rujukan_tidak_tepat: 35,
          pencapaian_target: 90.1,
        },
        {
          faskes_id: "FSK004",
          kunjungan: 1520,
          rujukan: 190,
          rujukan_tidak_tepat: 70,
          pencapaian_target: 81.5,
        },
        {
          faskes_id: "FSK005",
          kunjungan: 1380,
          rujukan: 160,
          rujukan_tidak_tepat: 85,
          pencapaian_target: 77.8,
        },
      ];

      let successCount = 0;
      let errors = [];

      // Process each record in a transaction
      const results = await sql.transaction(async (txn) => {
        const insertResults = [];

        for (const row of mockExcelData) {
          try {
            // Check if faskes exists
            const faskesExists = await txn`
              SELECT faskes_id FROM faskes WHERE faskes_id = ${row.faskes_id}
            `;

            if (faskesExists.length === 0) {
              errors.push(`Faskes ID ${row.faskes_id} tidak ditemukan`);
              continue;
            }

            // Insert or update capaian data
            const result = await txn`
              INSERT INTO capaian (
                faskes_id, bulan, tahun, kunjungan, rujukan, 
                rujukan_tidak_tepat, pencapaian_target, target
              ) VALUES (
                ${row.faskes_id}, ${bulan}, ${tahun}, ${row.kunjungan}, 
                ${row.rujukan}, ${row.rujukan_tidak_tepat}, 
                ${row.pencapaian_target}, 85.0
              )
              ON CONFLICT (faskes_id, bulan, tahun)
              DO UPDATE SET
                kunjungan = EXCLUDED.kunjungan,
                rujukan = EXCLUDED.rujukan,
                rujukan_tidak_tepat = EXCLUDED.rujukan_tidak_tepat,
                pencapaian_target = EXCLUDED.pencapaian_target,
                updated_at = CURRENT_TIMESTAMP
              RETURNING *
            `;

            insertResults.push(result[0]);
            successCount++;
          } catch (error) {
            console.error("Error processing row:", error);
            errors.push(`Error processing ${row.faskes_id}: ${error.message}`);
          }
        }

        return insertResults;
      });

      // Update upload history with results
      await sql`
        UPDATE upload_history 
        SET 
          upload_status = ${errors.length > 0 ? "completed" : "completed"},
          records_processed = ${successCount},
          errors = ${errors.length > 0 ? errors.join("; ") : null}
        WHERE id = ${uploadId}
      `;

      return Response.json({
        success: true,
        message: "Upload berhasil diproses",
        data: {
          uploadId,
          recordsProcessed: successCount,
          totalRecords: mockExcelData.length,
          errors: errors.length > 0 ? errors : null,
          status: errors.length === 0 ? "success" : "partial_success",
        },
      });
    } catch (processingError) {
      console.error("Processing error:", processingError);

      // Update upload history with error
      await sql`
        UPDATE upload_history 
        SET 
          upload_status = 'failed',
          errors = ${processingError.message}
        WHERE id = ${uploadId}
      `;

      return Response.json(
        { success: false, error: "Gagal memproses file Excel" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json(
      { success: false, error: "Upload gagal" },
      { status: 500 },
    );
  }
}
