export function RecommendationCard({ recommendation }) {
  const getRiskColor = (risk) => {
    switch (risk) {
      case "high":
        return "border-red-200 bg-red-50";
      case "medium":
        return "border-yellow-200 bg-yellow-50";
      case "low":
        return "border-green-200 bg-green-50";
      default:
        return "border-gray-200 bg-white";
    }
  };

  const getRiskIcon = (risk) => {
    return risk === "high" ? "🚨" : risk === "medium" ? "⚠️" : "ℹ️";
  };

  return (
    <div
      className={`p-4 rounded-lg border ${getRiskColor(recommendation.risk)}`}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl">{getRiskIcon(recommendation.risk)}</span>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 mb-1">
            {recommendation.faskes}
          </h4>
          <p className="text-sm text-gray-700 mb-2">{recommendation.message}</p>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {recommendation.action}
          </span>
        </div>
      </div>
    </div>
  );
}
