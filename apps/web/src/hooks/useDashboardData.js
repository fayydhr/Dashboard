import { useQuery } from "@tanstack/react-query";

export function useDashboardData(selectedRegion, selectedPeriod) {
  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats", selectedRegion, selectedPeriod],
    queryFn: async () => {
      const params = new URLSearchParams({
        wilayah: selectedRegion,
        periode: selectedPeriod,
      });
      const response = await fetch(`/api/dashboard/stats?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard stats");
      }
      return response.json();
    },
  });

  // Fetch performance trend data
  const { data: performanceData, isLoading: performanceLoading } = useQuery({
    queryKey: ["dashboard-performance", selectedRegion, selectedPeriod],
    queryFn: async () => {
      const params = new URLSearchParams({
        wilayah: selectedRegion,
        periode: selectedPeriod,
      });
      const response = await fetch(`/api/dashboard/performance?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch performance data");
      }
      return response.json();
    },
  });

  // Fetch ranking and recommendations
  const { data: rankingData, isLoading: rankingLoading } = useQuery({
    queryKey: ["dashboard-ranking", selectedRegion],
    queryFn: async () => {
      const params = new URLSearchParams({
        wilayah: selectedRegion,
        limit: "5",
      });
      const response = await fetch(`/api/dashboard/ranking?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch ranking data");
      }
      return response.json();
    },
  });

  return {
    stats,
    statsLoading,
    performanceData,
    performanceLoading,
    rankingData,
    rankingLoading,
  };
}
