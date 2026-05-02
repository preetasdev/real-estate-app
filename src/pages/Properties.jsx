import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Link } from "react-router-dom";
import ImportProperties from "../components/ImportProperties";

export default function Properties() {
  const { getFilteredProperties, deleteProperty, user } = useApp();

  const properties = getFilteredProperties();

  const [search, setSearch] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [sortKey, setSortKey] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  // 🔍 SEARCH
  const filtered = properties.filter((p) =>
    (p.title || "").toLowerCase().includes(search.toLowerCase())
  );

  // 🔃 SORT
  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;

    const valA = (a[sortKey] || "").toString().toLowerCase();
    const valB = (b[sortKey] || "").toString().toLowerCase();

    return sortAsc
      ? valA.localeCompare(valB)
      : valB.localeCompare(valA);
  });

  // 🔗 SHARE
  const handleShare = (id) => {
    const url = `${window.location.origin}/properties/${id}`;
    navigator.clipboard.writeText(url);
    alert("Link copied!");
  };

  // 📤 EXPORT CSV
  const exportCSV = () => {
    const headers = [
      "Title","Location","Price","Variant","Type",
      "Facing","FloorNo","TotalFloor","Furnishing","Parking"
    ];

    const rows = sorted.map(p => [
      p.title,
      p.location,
      p.price,
      p.variant,
      p.propertyType,
      p.facing,
      p.floorNo,
      p.totalFloor,
      p.furnishing,
      p.parking
    ]);

    const csv =
      [headers, ...rows]
        .map(row => row.join(","))
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "properties.csv";
    a.click();
  };

  // 🔃 SORT HANDLER
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <div>

      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Properties</h1>

        <div className="flex gap-2">
          <ImportProperties />

          {/* ✅ EXPORT BUTTON */}
          <button
            onClick={exportCSV}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Export CSV
          </button>
        </div>
      </div>

      <input
        placeholder="Search..."
        className="border p-2 rounded w-full mb-4"
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="bg-white rounded shadow overflow-auto">
        <table className="w-full text-left text-sm min-w-[1000px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Sr No</th>

              <th onClick={() => handleSort("title")} className="cursor-pointer">
                Title
              </th>

              <th onClick={() => handleSort("location")} className="cursor-pointer">
                Location
              </th>

              <th>Photo</th>

              <th onClick={() => handleSort("price")} className="cursor-pointer">
                Price
              </th>

              <th onClick={() => handleSort("variant")} className="cursor-pointer">
                Variant
              </th>

              <th onClick={() => handleSort("propertyType")} className="cursor-pointer">
                Type
              </th>

              <th onClick={() => handleSort("facing")} className="cursor-pointer">
                Facing
              </th>

              <th onClick={() => handleSort("floorNo")} className="cursor-pointer">
                Floor
              </th>

              <th onClick={() => handleSort("furnishing")} className="cursor-pointer">
                Furnishing
              </th>

              <th onClick={() => handleSort("parking")} className="cursor-pointer">
                Parking
              </th>

              <th>Share</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {sorted.map((p, index) => (
              <tr key={p.id} className="border-t">

                <td className="p-3">{index + 1}</td>

                <td className="text-indigo-600 font-medium">
                  <Link to={`/properties/${p.id}`}>
                    {p.title}
                  </Link>
                </td>

                <td>{p.location}</td>

                {/* IMAGE PREVIEW */}
                <td>
                  {p.images && p.images.length > 0 ? (
                    <img
                      src={p.images[0]}
                      alt="thumb"
                      className="w-14 h-14 object-cover rounded cursor-pointer border"
                      onClick={() => setPreviewImage(p.images[0])}
                    />
                  ) : (
                    <span className="text-gray-400 text-xs">
                      No Image
                    </span>
                  )}
                </td>

                <td>{p.price}</td>
                <td>{p.variant}</td>
                <td>{p.propertyType}</td>
                <td>{p.facing}</td>
                <td>{p.floorNo} / {p.totalFloor}</td>
                <td>{p.furnishing}</td>
                <td>{p.parking}</td>

                <td>
                  <button
                    onClick={() => handleShare(p.id)}
                    className="text-blue-500 hover:underline"
                  >
                    Share
                  </button>
                </td>

                <td>
                  {user?.role === "Admin" && (
                    <button
                      onClick={() => deleteProperty(p.id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* IMAGE PREVIEW MODAL */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="bg-white p-2 rounded shadow-lg max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImage}
              alt="preview"
              className="w-full max-h-[80vh] object-contain rounded"
            />

            <button
              className="mt-2 text-red-500 w-full"
              onClick={() => setPreviewImage(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}