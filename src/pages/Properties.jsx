import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Link } from "react-router-dom";
import ImportProperties from "../components/ImportProperties";

export default function Properties() {
  const { getFilteredProperties,deleteProperty } = useApp();
const properties = getFilteredProperties();
  const [search, setSearch] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  const filtered = properties.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleShare = (id) => {
    const url = `${window.location.origin}/properties/${id}`;
    navigator.clipboard.writeText(url);
    alert("Link copied!");
  };
  const { user } = useApp();
  

  return (
    <div>

      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Properties</h1>
        <ImportProperties />
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
              <th>Title</th>
              <th>Location</th>
              <th>Photo</th>
              <th>Price</th>
              <th>Variant</th>
              <th>Type</th>
              <th>Facing</th>
              <th>Floor</th>
              <th>Furnishing</th>
              <th>Parking</th>
              <th>Share</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((p, index) => (
              <tr key={p.id} className="border-t">

                <td className="p-3">{index + 1}</td>

                <td className="text-indigo-600 font-medium">
                  <Link to={`/properties/${p.id}`}>
                    {p.title}
                  </Link>
                </td>

                <td>{p.location}</td>

                {/* ✅ ONLY PREVIEW (NO UPLOAD HERE) */}
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

      {/* ✅ IMAGE PREVIEW MODAL */}
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