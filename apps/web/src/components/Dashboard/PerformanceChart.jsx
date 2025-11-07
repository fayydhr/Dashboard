import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function PerformanceChart({ data, isLoading }) {
  return (
    <div className="lg:col-span-2 p-6 rounded-xl border border-gray-200 bg-white space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Tren Capaian vs Prediksi</h3>
        <select className="border border-gray-300 rounded-md text-sm px-3 py-1.5">
          <option>Bulanan</option>
          <option>Kuartalan</option>
        </select>
      </div>

      <div className="w-full h-80">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse bg-gray-200 h-60 w-full rounded"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[70, 100]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#6B7280"
                strokeWidth={2}
                name="Target"
                strokeDasharray="5 5"
              />
              <Line
                type="monotone"
                dataKey="achieved"
                stroke="#1D4ED8"
                strokeWidth={3}
                name="Capaian Aktual"
              />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#F59E0B"
                strokeWidth={2}
                name="Prediksi"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
