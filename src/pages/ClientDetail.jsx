import { useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useState } from "react";

export default function ClientDetail() {
  const { id } = useParams();
  const { clients } = useApp();

  const client = clients.find((c) => c.id == id);

  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);

  if (!client) return <div>Client not found</div>;

  const addNote = () => {
    if (!note) return;

    setNotes([
      {
        text: note,
        date: new Date().toLocaleString(),
      },
      ...notes,
    ]);

    setNote("");
  };

  return (
    <div className="space-y-6">

      {/* 👤 PROFILE */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">
          {client.name}
        </h1>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <p><b>Phone:</b> {client.phone}</p>
          <p><b>Budget:</b> {client.budget}</p>
          <p><b>Location:</b> {client.locationPreference}</p>
          <p><b>Profile:</b> {client.profileType}</p>
          <p><b>Move In:</b> {client.moveInTimeline}</p>
          <p><b>Status:</b> {client.status}</p>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600">
            <b>Requirement:</b> {client.requirement}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <b>Notes:</b> {client.notes || "-"}
          </p>
        </div>
      </div>

      {/* 🏠 ASSIGNED PROPERTIES */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-3">
          Assigned Properties
        </h2>

        {client.properties.length === 0 ? (
          <p className="text-gray-500">No properties assigned</p>
        ) : (
          <ul className="space-y-2">
            {client.properties.map((p) => (
              <li
                key={p.id}
                className="border p-3 rounded"
              >
                {p.title} - {p.price}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 📝 ADD NOTE */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-3">Add Note</h2>

        <div className="flex gap-2">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add interaction note..."
            className="border p-2 rounded w-full"
          />

          <button
            onClick={addNote}
            className="bg-indigo-600 text-white px-4 rounded"
          >
            Add
          </button>
        </div>
      </div>

      {/* 🕒 TIMELINE */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-3">Activity Timeline</h2>

        {notes.length === 0 ? (
          <p className="text-gray-500">No activity yet</p>
        ) : (
          <div className="space-y-3">
            {notes.map((n, i) => (
              <div
                key={i}
                className="border-l-4 border-indigo-500 pl-3"
              >
                <p className="text-sm">{n.text}</p>
                <p className="text-xs text-gray-400">
                  {n.date}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}