import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function AddProperty() {
  const { addProperty, addPropertyImages } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    type: "Sale",
    variant: "2BHK",
    propertyType: "Apartment",

    possessionStatus: "Ready",
    possessionTime: "",
    carpetArea: "",
    balcony: "1",
    parking: "No",
    propertyVia: "Owner",

    facing: "East",
    floorNo: "",
    totalFloor: "",
    furnishing: "Unfurnished",

    description: "",
  });

  const [files, setFiles] = useState([]);

  const handleSubmit = () => {
    if (!form.title || !form.price) return;

    // ❗ IMPORTANT FIX
    const id = Date.now();

    // ✅ pass same id to property
    addProperty({ ...form, id });

    // ✅ use SAME id for images
    if (files.length > 0) {
      addPropertyImages(id, files);
    }

    navigate("/properties");
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
      <h1 className="text-xl font-bold mb-6">Add Property</h1>

      <div className="grid grid-cols-2 gap-4">

        <input
          placeholder="Title"
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          placeholder="Location"
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />

        <input
          placeholder="Price"
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <select
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option>Sale</option>
          <option>Rent</option>
        </select>

        <select
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, variant: e.target.value })}
        >
          <option>1RK</option>
          <option>1BHK</option>
          <option>2BHK</option>
          <option>3BHK</option>
          <option>4BHK</option>
        </select>

        <select
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
        >
          <option>Apartment</option>
          <option>Villa</option>
          <option>Independent House</option>
          <option>Commercial</option>
          <option>Plot</option>
        </select>

        <select
          className="border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, possessionStatus: e.target.value })
          }
        >
          <option>Ready</option>
          <option>Under Construction</option>
        </select>

        <input
          placeholder="Possession Time"
          className="border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, possessionTime: e.target.value })
          }
        />

        <input
          placeholder="Carpet Area (sqft)"
          className="border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, carpetArea: e.target.value })
          }
        />

        <select
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, balcony: e.target.value })}
        >
          <option>0</option>
          <option>1</option>
          <option>2</option>
        </select>

        <select
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, parking: e.target.value })}
        >
          <option>No</option>
          <option>Bike</option>
          <option>Car</option>
          <option>Both</option>
        </select>

        <select
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, propertyVia: e.target.value })}
        >
          <option>Owner</option>
          <option>Broker</option>
          <option>Builder</option>
        </select>

        <select
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, facing: e.target.value })}
        >
          <option>East</option>
          <option>West</option>
          <option>North</option>
          <option>South</option>
        </select>

        <input
          placeholder="Floor No"
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, floorNo: e.target.value })}
        />

        <input
          placeholder="Total Floors"
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, totalFloor: e.target.value })}
        />

        <select
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, furnishing: e.target.value })}
        >
          <option>Unfurnished</option>
          <option>Semi Furnished</option>
          <option>Fully Furnished</option>
        </select>
      </div>

      {/* 📸 IMAGE UPLOAD */}
      <div className="mt-4">
        <label className="block font-medium mb-2">Upload Photos</label>

        <input
          type="file"
          multiple
          onChange={(e) => setFiles(e.target.files)}
        />

        {/* PREVIEW */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          {Array.from(files).map((file, i) => (
            <img
              key={i}
              src={URL.createObjectURL(file)}
              alt="preview"
              className="h-24 w-full object-cover rounded"
            />
          ))}
        </div>
      </div>

      <textarea
        placeholder="Description"
        className="border p-2 rounded w-full mt-4"
        rows={3}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <button
        onClick={handleSubmit}
        className="bg-indigo-600 text-white px-4 py-2 rounded mt-6 w-full"
      >
        Save Property
      </button>
    </div>
  );
}