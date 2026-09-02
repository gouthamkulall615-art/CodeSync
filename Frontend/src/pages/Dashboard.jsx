import Navbar from "../components/Navbar";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-6xl w-full mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2 tracking-tight">
          Collaborative Real-time Workspace
        </h1>
        <p className="text-zinc-400 mb-10 text-sm">
          Host a new coding session instantly or enter a room code to join
          active teammates.
        </p>

        <div className="p-8 border border-dashed border-zinc-800 rounded-2xl text-center text-zinc-500">
          Dashboard Content Coming Next
        </div>
      </main>
    </div>
  );
}
