import { Building2, Activity, TrendingUp, AlertTriangle } from "lucide-react";
import { StatCard } from "./StatCard";

export function StatsGrid({ stats, isLoading }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {isLoading ? (
        // Loading skeleton
        [...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-6 rounded-xl border border-gray-200 bg-white animate-pulse"
          >
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        ))
      ) : (
        <>
          <StatCard
            icon={Building2}
            label="Total Faskes"
            value={stats?.totalFaskes?.value || "0"}
            delta={stats?.totalFaskes?.delta || "0"}
            trend={stats?.totalFaskes?.trend || "up"}
          />
          <StatCard
            icon={Activity}
            label="Capaian Rata-rata"
            value={stats?.avgAchievement?.value || "0%"}
            delta={stats?.avgAchievement?.delta || "0%"}
            trend={stats?.avgAchievement?.trend || "up"}
          />
          <StatCard
            icon={TrendingUp}
            label="Prediksi Bulan Depan"
            value={stats?.avgPrediction?.value || "0%"}
            delta={stats?.avgPrediction?.delta || "0%"}
            trend={stats?.avgPrediction?.trend || "up"}
          />
          <StatCard
            icon={AlertTriangle}
            label="Faskes Berisiko"
            value={stats?.riskFaskes?.value || "0"}
            delta={stats?.riskFaskes?.delta || "0"}
            trend={stats?.riskFaskes?.trend || "up"}
          />
        </>
      )}
    </div>
  );
}
