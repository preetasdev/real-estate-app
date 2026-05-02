import { useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useState } from "react";

export default function PropertyDetail() {
  const { id } = useParams();
  const { properties, addPropertyImages } = useApp();

  const [preview, setPreview] = useState(null);

  const property = properties.find((p) => p.id == id);

  if (!property) return <div>Property not found</div>;

  return (
    <div className="space-y-6">

      {/* MAIN INFO */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">
          {property.title}
        </h1>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <p><b>Location:</b> {property.location}</p>
          <p><b>Price:</b> {property.price}</p>
          <p><b>Type:</b> {property.type}</p>
          <p><b>Variant:</b> {property.variant}</p>
          <p><b>Property Type:</b> {property.propertyType}</p>
          <p><b>Facing:</b> {property.facing}</p>
          <p><b>Floor:</b> {property.floorNo} / {property.totalFloor}</p>
          <p><b>Furnishing:</b> {property.furnishing}</p>
          <p><b>Parking:</b> {property.parking}</p>
          <p><b>Carpet Area:</b> {property.carpetArea} sqft</p>
          <p><b>Possession:</b> {property.possessionStatus}</p>
          <p><b>Possession Time:</b> {property.possessionTime || "-"}</p>
          <p><b>Via:</b> {property.propertyVia}</p>
        </div>

        <div className="mt-4">
          <p className="text-gray-600">
            <b>Description:</b> {property.description || "-"}
          </p>
        </div>
      </div>

      {/* 📸 UPLOAD SECTION */}
      <div className="bg-white p-4 rounded-xl shadow">
        <label className="text-blue-500 cursor-pointer font-medium">
          Upload Images
          <input
            type="file"
            multiple
            hidden
            onChange={(e) =>
              addPropertyImages(property.id, e.target.files)
            }
          />
        </label>
      </div>

      {/* 🖼️ IMAGE GALLERY */}
      {property.images && property.images.length > 0 ? (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-3">Photos</h2>

          <div className="grid grid-cols-3 gap-3">
            {property.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="property"
                className="w-full h-32 object-cover rounded border cursor-pointer"
                onClick={() => setPreview(img)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-gray-500">
          No images uploaded
        </div>
      )}

      {/* 🔍 IMAGE PREVIEW MODAL */}
      {preview && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setPreview(null)}
        >
          <div
            className="bg-white p-2 rounded shadow-lg max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={preview}
              alt="preview"
              className="w-full max-h-[80vh] object-contain rounded"
            />

            <button
              className="mt-2 text-red-500 w-full"
              onClick={() => setPreview(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}