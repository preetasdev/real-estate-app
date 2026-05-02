import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

export function AppProvider({ children }) {

  // 👥 MOCK USERS
  const users = [
    { id: 1, username: "admin", password: "123", role: "Admin" },
    { id: 2, username: "agent1", password: "123", role: "Agent", teamId: 1 },
    { id: 3, username: "agent2", password: "123", role: "Agent", teamId: 1 },
    { id: 4, username: "lead1", password: "123", role: "TeamLead", teamId: 1 },
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

  // 🏘️ DATA LOAD
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem("properties");
    return saved ? JSON.parse(saved) : [];
  });

  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem("clients");
    return saved ? JSON.parse(saved) : [];
  });
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
useEffect(() => {
  localStorage.setItem("settings", JSON.stringify(settings));
}, [settings]);


  // 💾 SAVE
  useEffect(() => {
    localStorage.setItem("properties", JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem("clients", JSON.stringify(clients));
  }, [clients]);

  // 🛠️ CLEAN OLD DATA (VERY IMPORTANT FIX)
  useEffect(() => {
    setProperties((prev) =>
      prev.map((p, i) => ({
        ...p,
        id: p.id || Date.now() + Math.random() + i,
        createdBy: p.createdBy || user?.id || 1,
        teamId: p.teamId || user?.teamId || null,
        images: p.images || [],
      }))
    );

    setClients((prev) =>
      prev.map((c, i) => ({
        ...c,
        id: c.id || Date.now() + Math.random() + i,
        createdBy: c.createdBy || user?.id || 1,
        teamId: c.teamId || user?.teamId || null,
        properties: c.properties || [],
      }))
    );
  }, []);

  // 📸 ADD IMAGES (FIXED ID MATCH)
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

  // ➕ ADD PROPERTY (FIXED)
  const addProperty = (property) => {
    setProperties((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        createdAt: new Date().toISOString(),

        ...property,

        createdBy: user?.id,
        teamId: user?.teamId || null,

        images: [],
      },
    ]);
  };

  // ❌ DELETE PROPERTY (FINAL FIX)
  const deleteProperty = (id) => {
    setProperties((prev) =>
      prev.filter((p) => String(p.id) !== String(id))
    );
  };

  // ➕ ADD CLIENT (FIXED)
  const addClient = (client) => {
    setClients((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        createdAt: new Date().toISOString(),

        ...client,

        createdBy: user?.id,
        teamId: user?.teamId || null,

        status: "New",
        properties: [],
      },
    ]);
  };

  // 🔗 ASSIGN PROPERTY (FIXED MATCH)
  const assignProperty = (clientId, property) => {
    setClients((prev) =>
      prev.map((c) => {
        if (String(c.id) !== String(clientId)) return c;

        const exists = c.properties.some(
          (p) => String(p.id) === String(property.id)
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
        String(c.id) === String(id) ? { ...c, status } : c
      )
    );
  };

  // 🔐 FILTER PROPERTIES
  const getFilteredProperties = () => {
    if (!user) return [];

    if (user.role === "Admin") return properties;

    if (user.role === "TeamLead") {
      return properties.filter(
        (p) => String(p.teamId) === String(user.teamId)
      );
    }

    return properties.filter(
      (p) => String(p.createdBy) === String(user.id)
    );
  };

  // 🔐 FILTER CLIENTS
  const getFilteredClients = () => {
    if (!user) return [];

    if (user.role === "Admin") return clients;

    if (user.role === "TeamLead") {
      return clients.filter(
        (c) => String(c.teamId) === String(user.teamId)
      );
    }

    return clients.filter(
      (c) => String(c.createdBy) === String(user.id)
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

        settings,
        setSettings,

        getStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}