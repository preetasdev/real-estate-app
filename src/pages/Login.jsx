import { useState } from "react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!name || !password) return;

    const success = login(name, password);

    if (success) {
      navigate("/");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">

      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow w-96">

        {/* 🔥 LOGO + APP NAME */}
        <div className="flex flex-col items-center mb-6">
          
          {/* LOGO */}
          <img
            src="src/public/logo.png" // 👉 put logo in public folder
            alt="logo"
            className="w-16 h-16 mb-3"
          />

          {/* APP NAME */}
          <h1 className="text-2xl font-bold text-indigo-600">
            ESTATE CRM
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage properties & clients
          </p>
        </div>

        {/* LOGIN FORM */}
        <input
          placeholder="Username"
          className="border p-2 w-full mb-3 rounded"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4 rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="bg-indigo-600 text-white w-full py-2 rounded hover:bg-indigo-700 transition"
        >
          Login
        </button>

      </div>
    </div>
  );
}