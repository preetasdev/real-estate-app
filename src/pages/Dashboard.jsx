import { useApp } from "../context/AppContext";
import DashboardChart from "../components/DashboardChart";
import SocialLinks from "../components/SocialLinks";
function StatCard({ title, value }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-3xl font-bold mt-2 text-indigo-600">
        {value}
      </h2>
    </div>
  );
}

export default function Dashboard() {
  const { properties, clients } = useApp();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Dashboard Overview
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          title="Total Properties"
          value={properties.length}
        />
        <StatCard
          title="Total Clients"
          value={clients.length}
        />
        <StatCard
          title="Active Leads"
          value={
            clients.filter((c) => c.status !== "Closed").length
          }
        />
      </div>

      {/* 📊 CHART */}
      <DashboardChart />
      <SocialLinks />
    </div>
    
  );
}