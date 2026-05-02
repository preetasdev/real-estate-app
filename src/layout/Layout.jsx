import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useApp } from "../context/AppContext";

export default function Layout({ children }) {
  const { settings } = useApp();

  // 🎯 FONT SIZE MAP


  return (
    <div
      className={`flex h-screen transition-all duration-300 
      bg-gray-100 dark:bg-gray-900 
      text-gray-900 dark:text-gray-900 
      `}
    >
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="p-6 overflow-auto transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}