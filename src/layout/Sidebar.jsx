import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from "../public/logo.png"; // ✅ FIXED PATH

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="w-64 bg-white dark:bg-gray-800 p-5 shadow flex flex-col h-screen">

      {/* 🔥 LOGO + TITLE */}
      <div className="flex flex-col items-center mb-6">
        <img
          src={logo}
          alt="logo"
          className="w-16 h-16 object-contain mb-2" // ✅ SMALL + CLEAN
        />
        <h1 className="text-lg font-bold text-indigo-600">
          EstatePro
        </h1>
      </div>

      {/* 🔽 MENU (SCROLLABLE) */}
      <div className="flex-1 overflow-y-auto">

        {/* CORE */}
        <div className="mb-4">
          <p className="text-xs text-gray-400 mb-2">CORE</p>

          <Link to="/" className="block py-2 hover:text-indigo-600">
            Dashboard
          </Link>
        </div>

        {/* MANAGEMENT */}
        <div className="mb-4">
          <p className="text-xs text-gray-400 mb-2">MANAGEMENT</p>

          <Link to="/properties" className="block py-2 hover:text-indigo-600">
            Properties
          </Link>

          <Link to="/clients" className="block py-2 hover:text-indigo-600">
            Clients
          </Link>

          <Link to="/add-property" className="block py-2 hover:text-indigo-600">
            Add Property
          </Link>

          <Link to="/add-client" className="block py-2 hover:text-indigo-600">
            Add Client
          </Link>
        </div>
      </div>

      {/* 🔥 BOTTOM SECTION (FIXED POSITION) */}
      <div className="border-t pt-4">
        <Link to="/settings" className="block py-2 hover:text-indigo-600">
          Settings
        </Link>

        <Link to="/teams" className="block py-2 hover:text-indigo-600">
          Teams
        </Link>
      </div>

    </div>
  );
}