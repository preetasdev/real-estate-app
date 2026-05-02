import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Link } from "react-router-dom";
import ImportClients from "../components/ImportClients";

const statuses = ["All", "New", "Interested", "Closed"];

export default function Clients() {
  const {
    getFilteredClients,
    getFilteredProperties,
    assignProperty,
    updateClientStatus,
  } = useApp();

  // ✅ ROLE-BASED DATA
  const clients = getFilteredClients();
  const properties = getFilteredProperties();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // 🔍 FILTER LOGIC
  const filtered = clients.filter((c) => {
    const matchName = c.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "All" || c.status === statusFilter;

    return matchName && matchStatus;
  });

  return (
    <div>

      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Clients</h1>
        <ImportClients />
      </div>

      {/* SEARCH + FILTER */}
      <div className="bg-white p-4 rounded shadow mb-4 flex gap-2">
        <input
          placeholder="Search client..."
          className="border p-2 rounded w-full"
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-auto">
        <table className="w-full text-left text-sm min-w-[1100px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Sr No</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Budget</th>
              <th>Location</th>
              <th>Profile</th>
              <th>Status</th>
              <th>Assign</th>
              <th>Properties</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center p-6 text-gray-500">
                  No clients found
                </td>
              </tr>
            ) : (
              filtered.map((c, index) => (
                <tr key={c.id} className="border-t hover:bg-gray-50">

                  <td className="p-3">{index + 1}</td>

                  <td className="font-medium text-indigo-600">
                    <Link to={`/clients/${c.id}`}>
                      {c.name}
                    </Link>
                  </td>

                  <td>{c.phone || "-"}</td>
                  <td>{c.budget || "-"}</td>
                  <td>{c.locationPreference || "-"}</td>
                  <td>{c.profileType}</td>

                  {/* STATUS */}
                  <td>
                    <select
                      value={c.status}
                      onChange={(e) =>
                        updateClientStatus(c.id, e.target.value)
                      }
                      className="border p-1 rounded"
                    >
                      {statuses.slice(1).map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </td>

                  {/* ASSIGN PROPERTY */}
                  <td>
                    <select
                      onChange={(e) => {
                        const property = properties.find(
                          (p) => p.id == e.target.value
                        );
                        if (property) {
                          assignProperty(c.id, property);
                        }
                      }}
                      className="border p-1 rounded"
                    >
                      <option value="">Assign</option>
                      {properties.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* ASSIGNED PROPERTIES */}
                  <td className="text-xs text-gray-600">
                    {c.properties.length > 0
                      ? c.properties.map((p) => p.title).join(", ")
                      : "-"}
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}