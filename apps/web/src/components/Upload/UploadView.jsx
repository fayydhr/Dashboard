import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Upload,
  CheckCircle,
  XCircle,
  Loader,
  FileSpreadsheet,
} from "lucide-react";

export function UploadView() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [bulan, setBulan] = useState(new Date().getMonth() + 1);
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [dragActive, setDragActive] = useState(false);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await fetch("/api/upload/capaian", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Upload failed");
      }
      return response.json();
    },
    onSuccess: (data) => {
      setSelectedFile(null);
      // Invalidate dashboard queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-performance"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-ranking"] });
    },
    onError: (error) => {
      console.error("Upload error:", error);
    },
  });

  const handleFileSelect = (file) => {
    if (
      file &&
      (file.type === "application/vnd.ms-excel" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    ) {
      setSelectedFile(file);
    } else {
      alert("Harap pilih file Excel (.xls atau .xlsx)");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Pilih file terlebih dahulu");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("bulan", bulan.toString());
    formData.append("tahun", tahun.toString());
    formData.append("uploadedBy", "Admin BPJS");

    uploadMutation.mutate(formData);
  };

  return (
    <section className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Upload Data Capaian Faskes
        </h2>
        <p className="text-gray-600">
          Unggah file Excel dengan data capaian bulanan fasilitas kesehatan
        </p>
      </div>

      {/* Upload Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-6">
        {/* Period Selection */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bulan
            </label>
            <select
              value={bulan}
              onChange={(e) => setBulan(parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2024, i, 1).toLocaleDateString("id-ID", {
                    month: "long",
                  })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tahun
            </label>
            <select
              value={tahun}
              onChange={(e) => setTahun(parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Array.from({ length: 5 }, (_, i) => (
                <option key={2024 + i} value={2024 + i}>
                  {2024 + i}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : selectedFile
                ? "border-green-500 bg-green-50"
                : "border-gray-300 hover:border-gray-400"
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setDragActive(true)}
          onDragLeave={() => setDragActive(false)}
        >
          {selectedFile ? (
            <div className="space-y-4">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
              <div>
                <h3 className="text-lg font-medium text-green-900">
                  {selectedFile.name}
                </h3>
                <p className="text-sm text-green-600">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • File siap
                  untuk diupload
                </p>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-sm text-red-600 hover:text-red-700 underline"
              >
                Hapus file
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <FileSpreadsheet className="h-16 w-16 text-gray-400 mx-auto" />
              <div>
                <p className="text-lg font-medium text-gray-900">
                  Drag & drop file Excel di sini
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  atau klik untuk memilih file (.xls, .xlsx)
                </p>
              </div>
              <label className="inline-block">
                <input
                  type="file"
                  accept=".xls,.xlsx"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <span className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Pilih File Excel
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Upload Status */}
        {uploadMutation.isLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Loader className="h-5 w-5 text-blue-600 animate-spin" />
              <div>
                <p className="text-blue-900 font-medium">Memproses file...</p>
                <p className="text-blue-700 text-sm">
                  Validating dan menyimpan data ke database
                </p>
              </div>
            </div>
          </div>
        )}

        {uploadMutation.isSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-green-900 font-medium">Upload berhasil!</p>
                <p className="text-green-700 text-sm">
                  {uploadMutation.data?.data?.recordsProcessed} record berhasil
                  diproses dari {uploadMutation.data?.data?.totalRecords} total
                  record.
                </p>
                {uploadMutation.data?.data?.errors && (
                  <div className="mt-2">
                    <p className="text-yellow-700 text-sm font-medium">
                      Peringatan:
                    </p>
                    <ul className="text-yellow-600 text-sm list-disc list-inside">
                      {uploadMutation.data.data.errors.map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {uploadMutation.isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-red-900 font-medium">Upload gagal</p>
                <p className="text-red-700 text-sm">
                  {uploadMutation.error?.message ||
                    "Terjadi kesalahan saat upload file"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <div className="flex justify-end">
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploadMutation.isLoading}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {uploadMutation.isLoading ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                Upload Data
              </>
            )}
          </button>
        </div>
      </div>

      {/* Format Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">Format File Excel</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p>File Excel harus memiliki kolom berikut:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>
              <strong>faskes_id</strong>: ID unik fasilitas kesehatan (contoh:
              FSK001)
            </li>
            <li>
              <strong>kunjungan</strong>: Jumlah kunjungan bulanan
            </li>
            <li>
              <strong>rujukan</strong>: Jumlah rujukan
            </li>
            <li>
              <strong>rujukan_tidak_tepat</strong>: Jumlah rujukan tidak tepat
            </li>
            <li>
              <strong>pencapaian_target</strong>: Persentase pencapaian target
              (0-100)
            </li>
          </ul>
          <p className="mt-3">
            <strong>Catatan:</strong> Pastikan faskes_id sudah terdaftar di
            sistem sebelum upload.
          </p>
        </div>
      </div>
    </section>
  );
}
