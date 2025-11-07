import { Download, Bell } from "lucide-react";

export function DashboardHeader({
  selectedRegion,
  setSelectedRegion,
  selectedPeriod,
  setSelectedPeriod,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white sticky top-0 z-10 border-b border-gray-200">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard Monitoring Faskes</h1>
        <p className="text-gray-500 text-sm">
          Pantau kinerja dan prediksi capaian fasilitas kesehatan
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
        {/* Filters */}
        <div className="flex gap-2">
          <select
            className="border border-gray-300 rounded-lg text-sm px-3 py-2"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="all">Semua Wilayah</option>
            <option value="jakarta">Jakarta</option>
            <option value="bandung">Bandung</option>
            <option value="surabaya">Surabaya</option>
            <option value="medan">Medan</option>
          </select>

          <select
            className="border border-gray-300 rounded-lg text-sm px-3 py-2"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="3months">3 Bulan</option>
            <option value="6months">6 Bulan</option>
            <option value="1year">1 Tahun</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm">
            <Bell className="h-4 w-4" />
            Notifikasi
          </button>
        </div>
      </div>
    </div>
  );
}
