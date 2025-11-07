import { RankingCard } from "./RankingCard";

export function FaskesRanking({ data, isLoading }) {
  return (
    <div className="p-6 rounded-xl border border-gray-200 bg-white">
      <h3 className="font-semibold text-lg mb-4">Ranking Kinerja Faskes</h3>
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((faskes) => (
            <RankingCard key={faskes.rank} {...faskes} />
          ))}
        </div>
      )}
    </div>
  );
}
