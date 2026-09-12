import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";
import "../app/App.jsx";

const CURSOR_COLORS = [
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
];

export default function Workspace() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("pin");

  const [user] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const userColor = useMemo(
    () => CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)],
    [],
  );
  const [users, setUsers] = useState([]);
  const ydoc = useMemo(() => new Y.Doc(), []);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    if (!user?.name || !roomId) return;

    const provider = new SocketIOProvider(
      "http://localhost:5000",
      roomId,
      ydoc,
      { autoConnect: true },
    );

    const updateUsers = () => {
      const states = Array.from(provider.awareness.getStates().entries());
      setUsers(
        states
          .filter(([, state]) => state?.user?.username)
          .map(([clientId, state]) => ({ clientId, ...state.user })),
      );
    };

    provider.awareness.setLocalStateField("user", {
      username: user.name,
      color: userColor,
    });
    updateUsers();
    provider.awareness.on("change", updateUsers);

    const handleBeforeUnload = () =>
      provider.awareness.setLocalStateField("user", null);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      provider.awareness.off("change", updateUsers);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      provider.awareness.setLocalStateField("user", null);
      provider.disconnect();
      provider.destroy();
      setUsers([]);
    };
  }, [user, ydoc, roomId, userColor]);

  if (!user) return null;

  return (
    <main className="h-screen w-full bg-[#06080c] text-white flex overflow-hidden font-sans">
      <aside className="w-[280px] bg-[#0b0f15] border-r border-zinc-800 p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[13px] font-semibold text-zinc-400 uppercase tracking-wider">
            Active Peers
          </h2>
          <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
            {users.length}
          </span>
        </div>
        <div className="space-y-2">
          {users.map((u) => (
            <div
              key={u.clientId}
              className="flex items-center gap-3 p-2 bg-blue-500/5 border border-blue-500/30 rounded-md"
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-sm"
                style={{ backgroundColor: u.color }}
              >
                {u.username.charAt(0)}
              </div>
              <span className="text-sm font-medium text-zinc-200 truncate">
                {u.username}
              </span>
            </div>
          ))}
        </div>
      </aside>

      <section className="flex-1 flex items-center justify-center bg-[#06080c] min-w-0">
        <div className="placeholder-canvas text-zinc-500 text-sm">
          Canvas coming soon
        </div>
      </section>
    </main>
  );
}
