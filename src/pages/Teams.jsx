import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function Teams() {
  const {
    teams,
    createTeam,
    addMemberToTeam,
    removeMemberFromTeam,
    deleteTeam,
    user,
  } = useApp();

  const users = [
    { id: 1, username: "admin", role: "Admin" },
    { id: 2, username: "agent1", role: "Agent" },
    { id: 3, username: "agent2", role: "Agent" },
    { id: 4, username: "lead1", role: "TeamLead" },
  ];

  const leads = users.filter((u) => u.role === "TeamLead");
  const agents = users.filter((u) => u.role === "Agent");

  const [name, setName] = useState("");
  const [leadId, setLeadId] = useState("");

  if (user?.role !== "Admin" && user?.role !== "TeamLead") {
    return <div className="p-6">Access Denied</div>;
  }

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">Team Management</h1>

      {/* CREATE TEAM */}
      {user?.role === "Admin" && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-3">
          <h2 className="font-semibold">Create Team</h2>

          <input
            placeholder="Team Name"
            className="border p-2 rounded w-full"
            onChange={(e) => setName(e.target.value)}
          />

          <select
            className="border p-2 rounded w-full"
            onChange={(e) => setLeadId(e.target.value)}
          >
            <option value="">Select Team Lead</option>
            {leads.map((l) => (
              <option key={l.id} value={l.id}>
                {l.username}
              </option>
            ))}
          </select>

          <button
            onClick={() => createTeam(name, leadId)}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Create Team
          </button>
        </div>
      )}

      {/* TEAM LIST */}
      {teams.map((t) => {
        const lead = users.find((u) => u.id === t.leadId);

        return (
          <div
            key={t.id}
            className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-3"
          >
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg">{t.name}</h2>

              {/* ❌ DELETE BUTTON */}
              {user?.role === "Admin" && (
                <button
                  onClick={() => deleteTeam(t.id)}
                  className="text-red-500 text-sm"
                >
                  Delete
                </button>
              )}
            </div>

            <p><b>Lead:</b> {lead?.username || "-"}</p>

            {/* MEMBERS */}
            <div>
              <b>Members:</b>
              <div className="flex flex-wrap gap-2 mt-2">
                {t.members?.length ? (
                  t.members.map((m) => {
                    const member = users.find((u) => u.id === m);
                    return (
                      <span
                        key={m}
                        className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs flex items-center gap-2"
                      >
                        {member?.username}
                        <button
                          onClick={() =>
                            removeMemberFromTeam(t.id, m)
                          }
                          className="text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })
                ) : (
                  <span className="text-gray-400">None</span>
                )}
              </div>
            </div>

            {/* ADD MEMBER */}
            <select
              className="border p-2 rounded w-full"
              onChange={(e) =>
                addMemberToTeam(t.id, e.target.value)
              }
            >
              <option value="">Add Member</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.username}
                </option>
              ))}
            </select>
          </div>
        );
      })}
    </div>
  );
}