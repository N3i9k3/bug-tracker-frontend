import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="flex min-h-screen w-screen overflow-x-hidden bg-[#F8FAFC] font-sans text-slate-900">
      
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed md:static z-40
          top-0 left-0 h-full
          w-52                     /* 🔥 reduced from w-64 */
          bg-slate-900 text-white
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          flex flex-col shadow-2xl
        `}
      >
        {/* Logo */}
        <div className="p-4"> {/* 🔥 reduced padding */}
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span className="bg-blue-500 p-1.5 rounded-lg">BT</span>
            BugTracker
          </h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-2">
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-3">
            Main Menu
          </p>

          <Link
            to="/projects"
            onClick={() => setOpen(false)}
            className={`block px-3 py-2 rounded-lg ${
              isActive("/projects")
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            📁 Projects
          </Link>
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={logout}
            className="w-full text-left px-3 py-2 hover:bg-red-500/20 rounded-lg"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN AREA ================= */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="sticky top-0 z-20 bg-white border-b px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-xl"
              onClick={() => setOpen(true)}
            >
              ☰
            </button>

            <h1 className="font-semibold text-sm">Dashboard</h1>
          </div>

          <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            {initials}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

