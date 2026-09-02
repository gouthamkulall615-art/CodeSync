import { Search, Code2, ArrowRight, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const userInitial = userData.name
    ? userData.name.charAt(0).toUpperCase()
    : "U";
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
    <nav className="w-full bg-[#0a0a0c] border-b border-zinc-800/60 px-6 py-3.5 flex items-center justify-between font-sans text-white">
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

        <button
          onClick={handleLogout}
          title="click to logout"
          className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 hover:border-zinc-500 overflow-hidden ml-1 flex items-center justify-center text-sm font-medium text-zinc-300 transition-colors"
        >
          {userInitial}
        </button>
      </div>
    </nav>
  );
}
