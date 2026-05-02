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

  const clients = getFilteredClients();
  const properties = getFilteredProperties();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // ✅ NEW: SORT STATE
  const [sortKey, setSortKey] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  // 🔍 FILTER
  const filtered = clients.filter((c) => {
    const matchName = (c.name || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "All" || c.status === statusFilter;

    return matchName && matchStatus;
  });

  // 🔃 SORT
  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;

    const valA = (a[sortKey] || "").toString().toLowerCase();
    const valB = (b[sortKey] || "").toString().toLowerCase();

    return sortAsc
      ? valA.localeCompare(valB)
      : valB.localeCompare(valA);
  });

  // 🔃 SORT HANDLER
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  // 📤 EXPORT CSV
  const exportClientsCSV = () => {
    const headers = [
      "Name",
      "Phone",
      "Budget",
      "Location",
      "Profile",
      "Status",
      "MoveInTimeline",
    ];

    const rows = sorted.map((c) => [
      c.name,
      c.phone,
      c.budget,
      c.locationPreference,
      c.profileType,
      c.status,
      c.moveInTimeline,
    ]);

    const csv =
      [headers, ...rows]
        .map((row) => row.join(","))
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "clients.csv";
    a.click();
  };

  return (
    <div>

      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Clients</h1>

        <div className="flex gap-2">
          <ImportClients />

          {/* ✅ EXPORT BUTTON */}
          <button
            onClick={exportClientsCSV}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Export CSV
          </button>
        </div>
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

              <th
                onClick={() => handleSort("name")}
                className="cursor-pointer"
              >
                Name
              </th>

              <th>Phone</th>

              <th
                onClick={() => handleSort("budget")}
                className="cursor-pointer"
              >
                Budget
              </th>

              <th
                onClick={() => handleSort("locationPreference")}
                className="cursor-pointer"
              >
                Location
              </th>

              <th
                onClick={() => handleSort("profileType")}
                className="cursor-pointer"
              >
                Profile
              </th>

              <th
                onClick={() => handleSort("status")}
                className="cursor-pointer"
              >
                Status
              </th>

              <th>Assign</th>
              <th>Properties</th>
            </tr>
          </thead>

          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center p-6 text-gray-500">
                  No clients found
                </td>
              </tr>
            ) : (
              sorted.map((c, index) => (
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
                          (p) =>
                            String(p.id) === String(e.target.value) // ✅ FIXED
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