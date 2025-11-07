import { RecommendationCard } from "./RecommendationCard";

export function RecommendationsPanel({ data, isLoading }) {
  return (
    <div className="p-6 rounded-xl border border-gray-200 bg-white">
      <h3 className="font-semibold text-lg mb-4">Rekomendasi Tindakan</h3>
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((rec) => (
            <RecommendationCard key={rec.id} recommendation={rec} />
          ))}

          <button className="w-full mt-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium">
            Lihat Semua Rekomendasi
          </button>
        </div>
      )}
    </div>
  );
}
