import { TrendingUp, TrendingDown } from "lucide-react";

export function StatCard({ icon: Icon, label, value, delta, trend }) {
  const isPositive = trend === "up";
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="p-6 rounded-xl border border-gray-200 bg-white space-y-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-medium text-sm text-gray-600">{label}</h3>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      </div>
      <div
        className={`flex items-center gap-1 text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}
      >
        <TrendIcon className="h-4 w-4" />
        <span>{delta}</span>
        <span className="text-gray-500">dari bulan lalu</span>
      </div>
    </div>
  );
}
