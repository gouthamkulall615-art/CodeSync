import { useState, useRef, useEffect } from "react";
import { Search, Code2, ArrowRight, Plus, Settings, Moon, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const userInitial = userData.name ? userData.name.charAt(0).toUpperCase() : "U";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="w-full bg-[#0a0a0c] border-b border-zinc-800/60 px-6 py-3.5 flex items-center justify-between font-sans text-white relative">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 rounded-lg p-1.5 flex items-center justify-center shadow-[0_0_10px_rgba(37,99,235,0.3)]">
          <Code2 className="w-5 h-5 text-white" />
        </div>
        <span className="font-semibold text-lg tracking-wide">CodeSync</span>
      </div>

      <div className="hidden md:flex relative w-[400px] max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search active rooms, templates..."
          className="w-full bg-[#121214] border border-zinc-800/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-500"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full cursor-default">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-emerald-500 text-xs font-semibold tracking-wide">
            Room Active
          </span>
        </div>

        <div className="hidden sm:flex relative">
          <input
            type="text"
            placeholder="Join via Code..."
            className="w-44 bg-[#121214] border border-zinc-800/80 rounded-lg pl-3 pr-8 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-700 transition-all placeholder:text-zinc-600"
          />
          <button className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-zinc-300 transition-colors bg-zinc-800/50 hover:bg-zinc-700/50 rounded-md">
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:shadow-[0_0_20px_rgba(37,99,235,0.35)]">
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Host Room
        </button>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 hover:border-zinc-500 overflow-hidden ml-1 flex items-center justify-center text-sm font-medium text-zinc-300 transition-colors focus:outline-none"
          >
            {userInitial}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#0c0c0e] border border-zinc-800 rounded-2xl shadow-2xl py-2 z-50 text-sm animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2.5 border-b border-zinc-800/80 mb-1">
                <p className="font-medium text-zinc-200 truncate">{userData.name || "Developer"}</p>
                <p className="text-xs text-zinc-500 truncate">{userData.email || "user@codesync.io"}</p>
              </div>

              <button 
                onClick={() => setDropdownOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
              >
                <Settings className="w-4 h-4 text-zinc-500" />
                Settings
              </button>

              <button 
                onClick={() => setDropdownOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
              >
                <Moon className="w-4 h-4 text-zinc-500" />
                Theme (Dark)
              </button>

              <div className="border-t border-zinc-800/80 my-1"></div>

              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}