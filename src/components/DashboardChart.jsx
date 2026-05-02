import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { useApp } from "../context/AppContext";
import { useState } from "react";

export default function DashboardChart() {
  const { properties, clients } = useApp();
  const [range, setRange] = useState(7);

  const generateData = () => {
    const days = [];

    for (let i = range - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const dayStr = date.toISOString().split("T")[0];

      const propertyCount = properties.filter(
        (p) =>
          p.createdAt &&
          p.createdAt.startsWith(dayStr)
      ).length;

      const clientCount = clients.filter(
        (c) =>
          c.createdAt &&
          c.createdAt.startsWith(dayStr)
      ).length;

      days.push({
        date: dayStr.slice(5), // MM-DD
        Properties: propertyCount,
        Clients: clientCount,
      });
    }

    return days;
  };

  const data = generateData();

  return (
    <div className="bg-white p-5 rounded-xl shadow mt-6">

      <div className="flex justify-between mb-4">
        <h2 className="font-semibold">Activity Trend</h2>

        <select
          className="border p-1 rounded"
          value={range}
          onChange={(e) => setRange(Number(e.target.value))}
        >
          <option value={7}>Last 7 Days</option>
          <option value={30}>Last 30 Days</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            dataKey="Properties"
            stroke="#6366f1"
            strokeWidth={2}
          />

          <Line
            type="monotone"
            dataKey="Clients"
            stroke="#10b981"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}