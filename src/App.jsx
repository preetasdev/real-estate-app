import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import Clients from "./pages/Clients";
import AddProperty from "./pages/AddProperty";
import AddClient from "./pages/AddClient";
import ClientDetail from "./pages/ClientDetail";
import PropertyDetail from "./pages/PropertyDetail";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import { useApp } from "./context/AppContext";
import { useEffect } from "react";

function ProtectedRoute({ children }) {
  const { settings } = useApp();

  useEffect(() => {
  const root = document.documentElement;

  if (settings?.fontSize === "Small") {
    root.style.fontSize = "14px";
  } else if (settings?.fontSize === "Large") {
    root.style.fontSize = "18px";
  } else {
    root.style.fontSize = "16px";
  }
}, [settings?.fontSize]);

useEffect(() => {
  document.documentElement.classList.toggle(
    "dark",
    settings.theme === "dark"
  );
}, [settings.theme]);
  const { user } = useApp();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔐 LOGIN (PUBLIC) */}
        <Route path="/login" element={<Login />} />

        {/* 🔒 PROTECTED ROUTES */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/properties" element={<Properties />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/add-property" element={<AddProperty />} />
                  <Route path="/add-client" element={<AddClient />} />
                  <Route path="/clients/:id" element={<ClientDetail />} />
                  <Route path="/properties/:id" element={<PropertyDetail />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}