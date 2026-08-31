import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Code2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import api from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await api.post("/auth/google", {
          access_token: tokenResponse.access_token,
        });
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/");
      } catch (error) {
        setError(
          error.response?.data?.message || "google authentication failed",
        );
      }
    },
    onError: () => setError("google login failed"),
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center relative overflow-hidden font-sans p-4">
      <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:32px_32px] opacity-30"></div>

      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none translate-x-1/4 -translate-y-1/4"></div>

      <div className="absolute top-6 right-8 flex items-center gap-3">
        <span className="text-zinc-500 text-xs font-mono">v1.4.2</span>
        <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-1 rounded text-[10px] font-bold tracking-wider">
          SYSTEM ONLINE
        </span>
      </div>

      <div className="relative z-10 w-full max-w-[400px] bg-[#0a0a0c]/80 backdrop-blur-xl border border-zinc-800/60 rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600/20 border border-blue-500/30 p-3.5 rounded-2xl mb-5 shadow-[0_0_15px_rgba(37,99,235,0.15)]">
            <Code2 className="text-blue-500 w-6 h-6" />
          </div>
          <h1 className="text-xl font-semibold tracking-wide mb-6">CodeSync</h1>
          <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
          <p className="text-sm text-zinc-400">Sign in to your workspace</p>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center bg-red-500/10 py-2 rounded border border-red-500/20">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5 ml-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#050505] border border-zinc-800/80 rounded-xl pl-11 pr-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-600"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5 ml-1 mr-1">
              <label className="block text-xs font-medium text-zinc-400">
                Password
              </label>
              <Link
                to="#"
                className="text-xs font-medium text-blue-500 hover:text-blue-400 transition-colors"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#050505] border border-zinc-800/80 rounded-xl pl-11 pr-11 py-3 text-sm text-zinc-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-600"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.25)] hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] mt-2"
          >
            Sign In
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-zinc-800"></div>
          <span className="px-3 text-[10px] text-zinc-600 font-medium tracking-widest">
            OR
          </span>
          <div className="flex-grow border-t border-zinc-800"></div>
        </div>

        <button
          type="button"
          onClick={() => loginWithGoogle()}
          className="w-full flex items-center justify-center gap-2.5 bg-transparent border border-zinc-800 hover:bg-zinc-800/50 text-zinc-300 text-sm font-medium py-3 rounded-xl transition-colors mb-6"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-xs text-zinc-500 mt-auto">
          New to CodeSync?{" "}
          <Link
            to="/register"
            className="text-blue-500 hover:text-blue-400 font-medium transition-colors"
          >
            Create an account
          </Link>
        </p>
      </div>

      <div className="absolute bottom-8 flex gap-8 text-xs text-zinc-600">
        <Link to="#" className="hover:text-zinc-400 transition-colors">
          Privacy Policy
        </Link>
        <Link to="#" className="hover:text-zinc-400 transition-colors">
          Terms of Service
        </Link>
        <Link to="#" className="hover:text-zinc-400 transition-colors">
          Security
        </Link>
      </div>
    </div>
  );
}
