import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

export function AppProvider({ children }) {

  // 👥 MOCK USERS (acts like DB)
  const users = [
    { id: 1, username: "admin", password: "123", role: "Admin" },
    { id: 2, username: "agent1", password: "123", role: "Agent", teamId: 1 },
    { id: 3, username: "agent2", password: "123", role: "Agent", teamId: 1 },
    { id: 4, username: "lead1", password: "123", role: "TeamLead", teamId: 1 },
  ];

  // 🔐 AUTH STATE
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

  // 🏘️ LOAD DATA
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem("properties");
    return saved ? JSON.parse(saved) : [];
  });

  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem("clients");
    return saved ? JSON.parse(saved) : [];
  });

  // 💾 SAVE
  useEffect(() => {
    localStorage.setItem("properties", JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem("clients", JSON.stringify(clients));
  }, [clients]);

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
          p.id === id
            ? { ...p, images: [...(p.images || []), ...images] }
            : p
        )
      );
    });
  };

  // ➕ ADD PROPERTY (WITH OWNER + TEAM)
  const addProperty = (property) => {
    setProperties((prev) => [
      ...prev,
      {
        ...property,
        createdAt: new Date().toISOString(),
        createdBy: user.id,
        teamId: user.teamId || null,
        images: [],
      },
    ]);
  };

  // ❌ DELETE PROPERTY
  const deleteProperty = (id) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  // ➕ ADD CLIENT
  const addClient = (client) => {
    setClients((prev) => [
      ...prev,
      {
        id: Date.now(),
        createdAt: new Date().toISOString(),

        ...client,
        createdBy: user.id,
        teamId: user.teamId || null,

        status: "New",
        properties: [],
      },
    ]);
  };

  // 🔗 ASSIGN PROPERTY
  const assignProperty = (clientId, property) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id !== clientId) return c;

        const exists = c.properties.some((p) => p.id === property.id);
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
        c.id === id ? { ...c, status } : c
      )
    );
  };

  // 🔐 ROLE-BASED FILTERING
  const getFilteredProperties = () => {
    if (!user) return [];

    if (user.role === "Admin") return properties;

    if (user.role === "TeamLead") {
      return properties.filter((p) => p.teamId === user.teamId);
    }

    return properties.filter((p) => p.createdBy === user.id);
  };

  const getFilteredClients = () => {
    if (!user) return [];

    if (user.role === "Admin") return clients;

    if (user.role === "TeamLead") {
      return clients.filter((c) => c.teamId === user.teamId);
    }

    return clients.filter((c) => c.createdBy === user.id);
  };

  // 📊 STATS (ROLE BASED)
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

        getStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}