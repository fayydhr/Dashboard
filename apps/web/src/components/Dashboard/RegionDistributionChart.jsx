import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export function RegionDistributionChart({ data, isLoading }) {
  return (
    <div className="p-6 rounded-xl border border-gray-200 bg-white space-y-4">
      <h3 className="font-semibold text-lg">Distribusi Wilayah</h3>

      <div className="w-full h-64">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse bg-gray-200 h-48 w-48 rounded-full mx-auto"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
