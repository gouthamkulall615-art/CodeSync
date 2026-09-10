import { useRef, useMemo, useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Editor } from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";
import "../app/App.jsx";
import "../monaco";

// 1. Define a palette of premium colors for the cursors
const CURSOR_COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#8b5cf6", // Violet
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#ec4899", // Pink
];

export default function Workspace() {
  const editorRef = useRef(null);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("pin");

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 2. Pick a random color for the local user on mount
  const userColor = useMemo(
    () => CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)],
    [],
  );

  const [users, setUsers] = useState([]);
  const [editorReady, setEditorReady] = useState(false);

  const ydoc = useMemo(() => new Y.Doc(), []);
  const yText = useMemo(() => ydoc.getText("monaco"), [ydoc]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleMount = (editor) => {
    editorRef.current = editor;
    setEditorReady(true);
  };

  useEffect(() => {
    if (!user?.name || !editorReady || !editorRef.current || !roomId) {
      return;
    }

    const provider = new SocketIOProvider(
      "http://localhost:5000",
      roomId,
      ydoc,
      { autoConnect: true },
    );

    // 3. Update state mapper to capture the unique Yjs clientId alongside the user data
    const updateUsers = () => {
      const states = Array.from(provider.awareness.getStates().entries());
      setUsers(
        states
          .filter(([clientId, state]) => state?.user?.username)
          .map(([clientId, state]) => ({
            clientId,
            ...state.user,
          })),
      );
    };

    // 4. Inject the color into the awareness payload
    provider.awareness.setLocalStateField("user", {
      username: user.name,
      color: userColor,
    });

    updateUsers();
    provider.awareness.on("change", updateUsers);

    const model = editorRef.current.getModel();
    const monacoBinding = new MonacoBinding(
      yText,
      model,
      new Set([editorRef.current]),
      provider.awareness,
    );

    const handleBeforeUnload = () => {
      provider.awareness.setLocalStateField("user", null);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      provider.awareness.off("change", updateUsers);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      provider.awareness.setLocalStateField("user", null);
      monacoBinding.destroy();
      provider.disconnect();
      provider.destroy();
      setUsers([]);
    };
  }, [user, editorReady, yText, ydoc, roomId, userColor]);

  if (!user) return null;

  return (
    <main className="h-screen w-full bg-[#06080c] text-white flex overflow-hidden font-sans">
      {/* 5. Dynamic CSS Injection for Live Cursors */}
      <style>
        {`
          /* Base styles for the Monaco cursor decorations */
          .yRemoteSelectionHead {
            position: absolute;
            border-left: 2px solid currentColor;
            box-sizing: border-box;
            pointer-events: none;
          }
          
          /* Generate specific classes for each connected user */
          ${users
            .map(
              (u) => `
            .yRemoteSelection-${u.clientId} {
              background-color: ${u.color}33 !important; /* 33 is hex for 20% opacity */
            }
            .yRemoteSelectionHead-${u.clientId} {
              border-color: ${u.color} !important;
            }
            .yRemoteSelectionHead-${u.clientId}::after {
              content: "${u.username}";
              position: absolute;
              top: -18px;
              left: -2px;
              background-color: ${u.color};
              color: #ffffff;
              font-size: 11px;
              font-family: inherit;
              font-weight: 600;
              padding: 2px 6px;
              border-radius: 4px;
              border-bottom-left-radius: 0;
              white-space: nowrap;
              z-index: 100;
              pointer-events: none;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
          `,
            )
            .join("\n")}
        `}
      </style>

      {/* Left Sidebar: Active Peers */}
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
          {users.map((u, index) => (
            <div
              key={index}
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
              <div
                className="w-1.5 h-1.5 rounded-full animate-pulse ml-auto"
                style={{
                  backgroundColor: u.color,
                  boxShadow: `0 0 8px ${u.color}80`,
                }}
              />
            </div>
          ))}
        </div>
      </aside>

      {/* Right Section: Monaco Editor */}
      <section className="flex-1 flex flex-col bg-[#06080c]">
        <div className="h-10 border-b border-zinc-800 flex items-center bg-[#0b0f15]">
          <div className="h-full px-4 border-r border-zinc-800 flex items-center border-t-2 border-t-blue-500 bg-[#06080c]">
            <span className="text-zinc-300 text-sm font-mono">main.c</span>
          </div>
        </div>

        <div className="flex-1">
          <Editor
            height="100%"
            defaultLanguage="c"
            defaultValue="// Write your C logic here..."
            theme="vs-dark"
            onMount={handleMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: "on",
              padding: { top: 16 },
              cursorBlinking: "smooth",
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            }}
          />
        </div>
      </section>
    </main>
  );
}
