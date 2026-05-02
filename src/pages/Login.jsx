import { useState } from "react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!username || !password) return;

    const success = login(username, password);

    if (!success) {
      alert("Invalid username or password");
      return;
    }

    navigate("/");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4">Login</h2>

        {/* USERNAME */}
        <input
          placeholder="Username"
          className="border p-2 w-full mb-3 rounded"
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4 rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="bg-indigo-600 text-white w-full py-2 rounded"
        >
          Login
        </button>

        {/* DEMO USERS */}
        <div className="mt-4 text-xs text-gray-500">
          <p><b>Demo Users:</b></p>
          <p>admin / 123 (Admin)</p>
          <p>lead1 / 123 (Team Lead)</p>
          <p>agent1 / 123 (Agent)</p>
        </div>
      </div>
    </div>
  );
}