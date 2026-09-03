import Navbar from "../components/Navbar";
import WorkspaceCards from "../components/WorkspaceCards"; // adjust path if placed in components/dashboard/

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-6xl w-full mx-auto px-6 py-6">
        <WorkspaceCards />
      </main>
    </div>
  );
}
