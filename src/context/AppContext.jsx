import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

export function AppProvider({ children }) {

  // 👥 USERS
  const users = [
    { id: 1, username: "admin", password: "123", role: "Admin" },
    { id: 2, username: "agent1", password: "123", role: "Agent" },
    { id: 3, username: "agent2", password: "123", role: "Agent" },
    { id: 4, username: "lead1", password: "123", role: "TeamLead" },
  ];

  // 🔐 AUTH
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (username, password) => {
    const found = users.find(
      (u) => u.username === username && u.password === password
    );
    if (!found) return false;

    setUser(found);
    localStorage.setItem("user", JSON.stringify(found));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // 🏘️ DATA
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem("properties");
    return saved ? JSON.parse(saved) : [];
  });

  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem("clients");
    return saved ? JSON.parse(saved) : [];
  });

  // ⚙️ SETTINGS
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("settings");
    return saved
      ? JSON.parse(saved)
      : {
          theme: "light",
          fontSize: "medium",
          importCount: 0,
          exportCount: 0,
          lastLogin: new Date().toISOString(),
          recycleBin: [],
        };
  });

  // 👥 TEAMS
  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem("teams");
    return saved ? JSON.parse(saved) : [];
  });

  // 💾 SAVE
  useEffect(() => {
    localStorage.setItem("properties", JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem("clients", JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem("teams", JSON.stringify(teams));
  }, [teams]);

  // =========================
  // 🔥 TEAM FUNCTIONS
  // =========================

  const createTeam = (name, leadId) => {
    setTeams((prev) => [
      ...prev,
      {
        id: Date.now(),
        name,
        leadId: Number(leadId),
        members: [],
      },
    ]);
  };

  const addMemberToTeam = (teamId, userId) => {
    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId
          ? { ...t, members: [...t.members, Number(userId)] }
          : t
      )
    );
  };

  const removeMemberFromTeam = (teamId, userId) => {
    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId
          ? {
              ...t,
              members: t.members.filter((m) => m !== userId),
            }
          : t
      )
    );
  };

  // 🔍 GET TEAM OF USER
  const getUserTeam = () => {
    if (!user) return null;

    return teams.find(
      (t) =>
        Number(t.leadId) === Number(user.id) ||
        t.members.map(Number).includes(Number(user.id))
    );
  };

  // 📸 ADD IMAGES
  const addPropertyImages = (id, files) => {
    const readers = Array.from(files).map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((images) => {
      setProperties((prev) =>
        prev.map((p) =>
          String(p.id) === String(id)
            ? { ...p, images: [...(p.images || []), ...images] }
            : p
        )
      );
    });
  };

  // ➕ ADD PROPERTY
  const addProperty = (property) => {
    const team = getUserTeam();

    setProperties((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        createdAt: new Date().toISOString(),
        ...property,
        createdBy: Number(user?.id),
        teamId: team?.id || null,
        images: [],
      },
    ]);
  };

  // ❌ DELETE PROPERTY
  const deleteProperty = (id) => {
    setProperties((prev) =>
      prev.filter((p) => Number(p.id) !== Number(id))
    );
  };

  // ➕ ADD CLIENT
  const addClient = (client) => {
    const team = getUserTeam();

    setClients((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        createdAt: new Date().toISOString(),
        ...client,
        createdBy: Number(user?.id),
        teamId: team?.id || null,
        status: "New",
        properties: [],
      },
    ]);
  };

  // 🔗 ASSIGN PROPERTY
  const assignProperty = (clientId, property) => {
    setClients((prev) =>
      prev.map((c) => {
        if (Number(c.id) !== Number(clientId)) return c;

        const exists = c.properties.some(
          (p) => Number(p.id) === Number(property.id)
        );

        if (exists) return c;

        return {
          ...c,
          properties: [...c.properties, property],
        };
      })
    );
  };

  // 🎯 UPDATE STATUS
  const updateClientStatus = (id, status) => {
    setClients((prev) =>
      prev.map((c) =>
        Number(c.id) === Number(id) ? { ...c, status } : c
      )
    );
  };

  // 🔐 FILTER PROPERTIES
  const getFilteredProperties = () => {
    if (!user) return [];

    if (user.role === "Admin") return properties;

    const team = getUserTeam();

    if (user.role === "TeamLead" && team) {
      const teamUserIds = [
        Number(team.leadId),
        ...team.members.map(Number),
      ];

      return properties.filter((p) =>
        teamUserIds.includes(Number(p.createdBy))
      );
    }

    return properties.filter(
      (p) => Number(p.createdBy) === Number(user.id)
    );
  };

  // 🔐 FILTER CLIENTS
  const getFilteredClients = () => {
    if (!user) return [];

    if (user.role === "Admin") return clients;

    const team = getUserTeam();

    if (user.role === "TeamLead" && team) {
      const teamUserIds = [
        Number(team.leadId),
        ...team.members.map(Number),
      ];

      return clients.filter((c) =>
        teamUserIds.includes(Number(c.createdBy))
      );
    }

    return clients.filter(
      (c) => Number(c.createdBy) === Number(user.id)
    );
  };

  // 📊 STATS
  const getStats = () => {
    const filteredClients = getFilteredClients();
    const filteredProperties = getFilteredProperties();

    const statusCount = {
      New: 0,
      Interested: 0,
      Closed: 0,
    };

    filteredClients.forEach((c) => {
      if (statusCount[c.status] !== undefined) {
        statusCount[c.status]++;
      }
    });

    return {
      totalProperties: filteredProperties.length,
      totalClients: filteredClients.length,
      statusCount,
    };
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,

        properties,
        clients,

        getFilteredProperties,
        getFilteredClients,

        addProperty,
        addPropertyImages,
        deleteProperty,

        addClient,
        assignProperty,
        updateClientStatus,

        teams,
        createTeam,
        addMemberToTeam,
        removeMemberFromTeam,

        settings,
        setSettings,

        getStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}