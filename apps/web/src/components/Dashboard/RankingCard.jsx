export function RankingCard({ faskes, rank, achievement, prediction, status }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-blue-100 text-blue-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "poor":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center font-semibold">
          {rank}
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{faskes}</h4>
          <p className="text-sm text-gray-500">
            Capaian: {achievement}% | Prediksi: {prediction}%
          </p>
        </div>
      </div>
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}
      >
        {status === "excellent" && "Sangat Baik"}
        {status === "good" && "Baik"}
        {status === "warning" && "Perhatian"}
        {status === "poor" && "Perlu Perbaikan"}
      </span>
    </div>
  );
}
