import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Topbar() {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white px-6 py-3 flex justify-between items-center shadow">

      {/* SEARCH */}
      <input
        className="border rounded-xl px-4 py-2 w-1/3 text-gray-800"
        placeholder="Search..."
      />

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">

        {/* ➕ ADD DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            + Add
          </button>

          {open && (
            <div className="absolute right-0 mt-2 bg-white shadow rounded w-40">
              <button
                onClick={() => {
                  navigate("/add-property");
                  setOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Add Property
              </button>

              <button
                onClick={() => {
                  navigate("/add-client");
                  setOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Add Client
              </button>
            </div>
          )}
        </div>

        {/* USER INFO */}
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-600">
            {user?.username} ({user?.role})
          </div>

          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
            {user?.username?.charAt(0)?.toUpperCase()}
          </div>
        </div>

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="text-red-500 text-sm"
        >
          Logout
        </button>

      </div>
    </div>
  );
}