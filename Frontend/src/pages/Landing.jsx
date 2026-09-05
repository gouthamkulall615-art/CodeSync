import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import LandingNavbar from "../components/LandingNavbar";
import { ArrowRight } from "lucide-react";

export default function Landing() {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-[#050505] text-white relative font-sans overflow-x-hidden selection:bg-blue-500/30 selection:text-blue-200">
      <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:32px_32px] opacity-25 pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 px-6 max-w-6xl mx-auto flex flex-col items-center text-center z-10">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0d0d12] border border-zinc-800/80 mb-8 cursor-pointer hover:border-zinc-700 transition-colors shadow-lg">
          <span className="bg-blue-600/20 text-blue-400 text-[11px] font-bold px-2 py-0.5 rounded-full tracking-wide uppercase border border-blue-500/30">
            VERSION 2.0
          </span>
          <span className="text-xs text-zinc-300 font-medium flex items-center gap-1">
            Introducing Collaborative Terminals
            <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
          </span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.1] text-white max-w-4xl mb-6">
          Code{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">
            Together,
          </span>
          <br />
          Build Faster.
        </h1>

        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed mb-10">
          The high-performance, real-time collaborative workspace for modern
          development teams. Live pair programming, instant environment
          terminals, and AI completions.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16">
          <Link
            to="/register"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-medium px-7 py-3.5 rounded-xl transition-all shadow-[0_0_25px_rgba(37,99,235,0.35)] hover:shadow-[0_0_35px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2"
          >
            Start Free Session
          </Link>
          <a
            href="#docs"
            className="w-full sm:w-auto bg-[#0e0e11] hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-medium px-7 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            View Documentation
          </a>
        </div>

        {/* Editor Mockup */}
        <div
          id="docs"
          className="w-full max-w-4xl relative rounded-2xl border border-zinc-800/80 bg-[#09090b]/90 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.8)] overflow-hidden text-left font-mono scroll-mt-32"
        >
          <div className="bg-[#0e0e11] border-b border-zinc-800/80 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5 mr-4">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              </div>

              <div className="flex items-center gap-1 text-xs">
                <div className="px-3 py-1 bg-zinc-900/50 text-zinc-500 rounded-md">
                  bash – codesync-server
                </div>
                <div className="px-3 py-1 bg-zinc-900/50 text-zinc-500 rounded-md">
                  tailwind.config.js
                </div>
                <div className="px-3 py-1 bg-[#18181b] text-zinc-200 font-medium rounded-md border border-zinc-800 flex items-center gap-2">
                  <span>index.tsx</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              <div className="flex -space-x-1.5">
                <div className="w-4 h-4 rounded-full bg-pink-500 border border-[#0e0e11]"></div>
                <div className="w-4 h-4 rounded-full bg-emerald-500 border border-[#0e0e11]"></div>
                <div className="w-4 h-4 rounded-full bg-blue-500 border border-[#0e0e11]"></div>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 font-sans">
                3 Online
              </span>
            </div>
          </div>

          <div className="p-6 text-xs sm:text-sm leading-relaxed overflow-x-auto relative">
            <div className="text-zinc-500 mb-4 font-mono">
              <span className="text-emerald-400">$</span> npm run dev
              <br />
              <span className="text-zinc-600">
                &gt; codesync-server@1.4.2 dev
              </span>
              <br />
              <span className="text-blue-400">ready</span>
            </div>

            <div className="space-y-1 text-zinc-300 relative">
              <div>
                <span className="text-zinc-600 mr-4">1</span>
                <span className="text-purple-400">import</span> &#123; useSync
                &#125; <span className="text-purple-400">from</span>{" "}
                <span className="text-emerald-300">
                  &apos;@codesync/react&apos;
                </span>
                ;
              </div>
              <div>
                <span className="text-zinc-600 mr-4">2</span>
                <span className="text-blue-400">
                  export default function
                </span>{" "}
                <span className="text-yellow-200">App</span>() &#123;
              </div>

              <div className="relative inline-block w-full">
                <span className="text-zinc-600 mr-4">3</span>
                <span className="text-blue-400">const</span> [editorState,
                setEditorState] ={" "}
                <span className="text-yellow-200">useSync</span>(
                <span className="absolute left-[380px] top-0 bg-pink-500 text-white text-[10px] px-1.5 py-0.5 rounded-md font-sans flex items-center gap-1 shadow-md z-20">
                  <span className="w-1 h-1 bg-white rounded-full animate-ping"></span>
                  Sarah
                </span>
              </div>

              <div className="relative inline-block w-full">
                <span className="text-zinc-600 mr-4">4</span>
                &nbsp;&nbsp;
                <span className="text-emerald-300">
                  &apos;f8a2-9bc1-e872&apos;
                </span>
                , &#123; active: <span className="text-purple-400">true</span>{" "}
                &#125;);
                <span className="absolute left-[210px] -top-1 bg-emerald-500 text-black font-semibold text-[10px] px-1.5 py-0.5 rounded-md font-sans shadow-md z-20">
                  Devon
                </span>
              </div>

              <div>
                <span className="text-zinc-600 mr-4">5</span>&nbsp;&nbsp;
                <span className="text-purple-400">return</span> (
              </div>

              <div className="relative inline-block w-full">
                <span className="text-zinc-600 mr-4">6</span>
                &nbsp;&nbsp;&nbsp;&nbsp;&lt;
                <span className="text-blue-400">EditorCanvas</span>{" "}
                state=&#123;editorState&#125; /&gt;
                <span className="absolute left-[290px] top-1 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-md font-sans shadow-md z-20">
                  John (You)
                </span>
              </div>

              <div>
                <span className="text-zinc-600 mr-4">7</span>&nbsp;&nbsp;);
              </div>
              <div>
                <span className="text-zinc-600 mr-4">8</span>&#125;;
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Sections for Smooth Navigation */}
      <section
        id="features"
        className="py-20 px-6 max-w-6xl mx-auto border-t border-zinc-800/60 scroll-mt-28"
      >
        <h2 className="text-3xl font-bold text-center mb-4">Features</h2>
        <p className="text-zinc-400 text-center max-w-lg mx-auto">
          Real-time sync, embedded terminals, and AI assistance built right into
          your browser.
        </p>
      </section>

      <section
        id="pricing"
        className="py-20 px-6 max-w-6xl mx-auto border-t border-zinc-800/60 scroll-mt-28"
      >
        <h2 className="text-3xl font-bold text-center mb-4">Pricing</h2>
        <p className="text-zinc-400 text-center max-w-lg mx-auto">
          Free for individuals and small teams. Flexible plans for enterprise
          scale.
        </p>
      </section>

      <section
        id="enterprise"
        className="py-20 px-6 max-w-6xl mx-auto border-t border-zinc-800/60 scroll-mt-28"
      >
        <h2 className="text-3xl font-bold text-center mb-4">Enterprise</h2>
        <p className="text-zinc-400 text-center max-w-lg mx-auto">
          Custom deployments, SAML SSO, dedicated infrastructure, and 24/7 SLA
          support.
        </p>
      </section>
    </div>
  );
}
