import { useState } from "react";
import { Code2, Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (id) => {
    setMobileMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="w-full flex justify-center pt-6 px-4 fixed top-0 z-50">
      <div className="flex items-center justify-between w-full max-w-5xl bg-[#0a0a0c]/85 backdrop-blur-xl border border-zinc-800/80 rounded-full px-6 py-3 shadow-2xl relative">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-blue-600/10 border border-blue-500/20 p-1.5 rounded-lg">
            <Code2 className="w-5 h-5 text-blue-500" />
          </div>
          <span className="text-white font-semibold tracking-wide text-lg">CodeSync</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => handleNavClick("features")} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer">
            Features
          </button>
          <button onClick={() => handleNavClick("docs")} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer">
            Docs
          </button>
          <button onClick={() => handleNavClick("pricing")} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer">
            Pricing
          </button>
          <button onClick={() => handleNavClick("enterprise")} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer">
            Enterprise
          </button>
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-5">
          <Link to="/login" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link 
            to="/register" 
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2 rounded-full transition-all shadow-[0_0_15px_rgba(37,99,235,0.25)] hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="md:hidden text-zinc-400 hover:text-white p-1"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-3 bg-[#0a0a0c]/95 border border-zinc-800 rounded-3xl p-6 flex flex-col gap-4 shadow-2xl md:hidden backdrop-blur-xl">
            <button onClick={() => handleNavClick("features")} className="text-left text-sm font-medium text-zinc-300 hover:text-white py-1">
              Features
            </button>
            <button onClick={() => handleNavClick("docs")} className="text-left text-sm font-medium text-zinc-300 hover:text-white py-1">
              Docs
            </button>
            <button onClick={() => handleNavClick("pricing")} className="text-left text-sm font-medium text-zinc-300 hover:text-white py-1">
              Pricing
            </button>
            <button onClick={() => handleNavClick("enterprise")} className="text-left text-sm font-medium text-zinc-300 hover:text-white py-1">
              Enterprise
            </button>
            <div className="border-t border-zinc-800/80 my-1"></div>
            <Link to="/login" className="text-sm font-medium text-zinc-300 hover:text-white py-1">
              Sign In
            </Link>
            <Link to="/register" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2.5 rounded-full text-center">
              Get Started
            </Link>
          </div>
        )}

      </div>
    </nav>
  );
}