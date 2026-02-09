import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

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
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      {/* ===============================
          SIDEBAR (Desktop only)
      =============================== */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-white flex-col shadow-2xl">
        {/* Logo */}
        <div className="p-8">
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <span className="bg-blue-500 p-1.5 rounded-lg text-white">BT</span>
            <span>
              Bug<span className="text-blue-400">Tracker</span>
            </span>
          </h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-4 mb-4">
            Main Menu
          </p>

          <Link
            to="/projects"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              isActive("/projects")
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span>📁</span>
            <span className="font-medium">Projects</span>
          </Link>
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-medium"
          >
            🚪 Logout
          </button>

          <div className="mt-4 px-4 py-2 text-[10px] text-slate-500 text-center italic">
            © 2026 BugTracker v1.0
          </div>
        </div>
      </aside>

      {/* ===============================
          MAIN AREA (Full width on mobile)
      =============================== */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-4 flex justify-between items-center">
          {/* Breadcrumb */}
          <div>
            <h1 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">
              Dashboard
            </h1>

            <nav className="flex text-xs font-medium text-slate-600">
              <span className="text-slate-400">App</span>
              <span className="mx-2">/</span>
              <span className="capitalize">
                {location.pathname.replace("/", "") || "home"}
              </span>
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Search (desktop only) */}
            <div className="hidden md:flex bg-slate-100 border border-slate-200 rounded-full px-4 py-1.5 items-center gap-2">
              🔍
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm w-48"
              />
            </div>

            {/* Avatar */}
            <div className="h-10 w-10 rounded-full bg-blue-600 text-white border-2 border-white shadow-sm flex items-center justify-center font-bold cursor-pointer">
              {initials}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
