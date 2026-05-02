import { useApp } from "../context/AppContext";

export default function Settings() {
  const { settings, setSettings } = useApp();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="bg-white p-4 rounded shadow">
        <h2>Theme</h2>
       <button
  onClick={() =>
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === "dark" ? "light" : "dark",
    }))
  }
  className="bg-indigo-600 text-white px-3 py-1 rounded"
>
  Toggle Theme ({settings.theme})
</button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2>Font Size</h2>
        <select
          value={settings.fontSize}
          onChange={(e) =>
            setSettings(prev => ({...prev, fontSize:e.target.value}))
          }
        >
          <option>Small</option>
          <option>Medium</option>
          <option>Large</option>
        </select>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2>Last Login</h2>
        <p>{new Date(settings.lastLogin).toLocaleString()}</p>
      </div>
    </div>
  );
}