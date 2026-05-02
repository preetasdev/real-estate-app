import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function AddClient() {
  const { addClient } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    budget: "",
    requirement: "",
    locationPreference: "",
    profileType: "Family",
    propertyStatus: "Ready",
    moveInTimeline: "Immediate",
    notes: "",
  });

  const handleSubmit = () => {
    if (!form.name) return;

    addClient(form);
    navigate("/clients");
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
      <h1 className="text-xl font-bold mb-6">Add Client</h1>

      <div className="grid grid-cols-2 gap-4">

        {/* NAME */}
        <input
          placeholder="Full Name"
          className="border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        {/* PHONE */}
        <input
          placeholder="Phone"
          className="border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        {/* BUDGET */}
        <input
          placeholder="Budget"
          className="border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, budget: e.target.value })
          }
        />

        {/* LOCATION */}
        <input
          placeholder="Preferred Location"
          className="border p-2 rounded"
          onChange={(e) =>
            setForm({
              ...form,
              locationPreference: e.target.value,
            })
          }
        />

        {/* PROFILE TYPE */}
        <select
          className="border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, profileType: e.target.value })
          }
        >
          <option>Family</option>
          <option>Bachelor</option>
          <option>Company Lease</option>
        </select>

        {/* PROPERTY STATUS */}
        <select
          className="border p-2 rounded"
          onChange={(e) =>
            setForm({
              ...form,
              propertyStatus: e.target.value,
            })
          }
        >
          <option>Ready</option>
          <option>Under Construction</option>
        </select>

        {/* MOVE-IN TIMELINE */}
        <select
          className="border p-2 rounded"
          onChange={(e) =>
            setForm({
              ...form,
              moveInTimeline: e.target.value,
            })
          }
        >
          <option>Immediate</option>
          <option>1-3 Months</option>
          <option>3-6 Months</option>
          <option>Flexible</option>
        </select>

        {/* REQUIREMENT */}
        <input
          placeholder="Requirement (2BHK, 3BHK)"
          className="border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, requirement: e.target.value })
          }
        />

      </div>

      {/* NOTES */}
      <textarea
        placeholder="Additional Requirements / Notes"
        className="border p-2 rounded w-full mt-4"
        rows={3}
        onChange={(e) =>
          setForm({ ...form, notes: e.target.value })
        }
      />

      {/* SUBMIT */}
      <button
        onClick={handleSubmit}
        className="bg-indigo-600 text-white px-4 py-2 rounded mt-6 w-full"
      >
        Save Client
      </button>
    </div>
  );
}