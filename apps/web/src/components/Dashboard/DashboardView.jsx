import { StatsGrid } from "./StatsGrid";
import { PerformanceChart } from "./PerformanceChart";
import { RegionDistributionChart } from "./RegionDistributionChart";
import { FaskesRanking } from "./FaskesRanking";
import { RecommendationsPanel } from "./RecommendationsPanel";

const regionData = [
  { name: "Jakarta", value: 45, color: "#1D4ED8" },
  { name: "Bandung", value: 25, color: "#6366F1" },
  { name: "Surabaya", value: 20, color: "#8B5CF6" },
  { name: "Medan", value: 10, color: "#06B6D4" },
];

const faskesRankingData = [
  {
    rank: 1,
    name: "RSUD Jakarta Pusat",
    achievement: 95.2,
    prediction: 96.1,
    status: "excellent",
  },
  {
    rank: 2,
    name: "RS Bandung Medical Center",
    achievement: 92.8,
    prediction: 93.5,
    status: "good",
  },
  {
    rank: 3,
    name: "RSUP Surabaya",
    achievement: 89.3,
    prediction: 88.7,
    status: "good",
  },
  {
    rank: 4,
    name: "RS Medan Prima",
    achievement: 85.1,
    prediction: 82.4,
    status: "warning",
  },
  {
    rank: 5,
    name: "RSUD Bekasi",
    achievement: 78.9,
    prediction: 79.3,
    status: "poor",
  },
];

const recommendationsData = [
  {
    id: 1,
    faskes: "RS Medan Prima",
    risk: "high",
    message:
      "Prediksi pencapaian di bawah target. Perlu monitoring intensif sistem rujukan.",
    action: "Evaluasi SOP rujukan",
  },
  {
    id: 2,
    faskes: "RSUD Bekasi",
    risk: "medium",
    message: "Tren penurunan kunjungan. Evaluasi kapasitas dan layanan.",
    action: "Peningkatan promosi kesehatan",
  },
];

export function DashboardView({
  stats,
  statsLoading,
  performanceData,
  performanceLoading,
  rankingData,
  rankingLoading,
}) {
  return (
    <section className="p-6 space-y-6">
      {/* Stat Cards Row */}
      <StatsGrid stats={stats?.data} isLoading={statsLoading} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Trend Chart */}
        <PerformanceChart
          data={performanceData?.data?.performanceTrend || []}
          isLoading={performanceLoading}
        />

        {/* Regional Distribution */}
        <RegionDistributionChart
          data={performanceData?.data?.regionDistribution || regionData}
          isLoading={performanceLoading}
        />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Faskes Ranking */}
        <FaskesRanking
          data={rankingData?.data?.ranking || faskesRankingData}
          isLoading={rankingLoading}
        />

        {/* Recommendations */}
        <RecommendationsPanel
          data={rankingData?.data?.recommendations || recommendationsData}
          isLoading={rankingLoading}
        />
      </div>
    </section>
  );
}
