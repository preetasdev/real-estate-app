import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-white p-5 shadow flex flex-col gap-6">
      
      <h1 className="text-xl font-bold text-indigo-600">EstatePro</h1>

      <div>
        <p className="text-xs text-gray-400 mb-2">CORE</p>
        <Link to="/" className="block py-2 hover:text-indigo-600">Dashboard</Link>
      </div>

      <div>
        <p className="text-xs text-gray-400 mb-2">MANAGEMENT</p>
        <Link to="/properties" className="block py-2 hover:text-indigo-600">Properties</Link>
        <Link to="/clients" className="block py-2 hover:text-indigo-600">Clients</Link>
        <Link to="/add-property" className="block py-2 hover:text-indigo-600">Add Property</Link>
        <Link to="/add-client" className="block py-2 hover:text-indigo-600">Add Client</Link>
      </div>

      <div>
        <p className="text-xs text-gray-400 mb-2">SETTINGS</p>
        <span className="block py-2 text-gray-300">Settings (Soon)</span>
      </div>
    </div>
  );
}