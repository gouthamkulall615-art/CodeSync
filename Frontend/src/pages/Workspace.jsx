import { useRef, useMemo, useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Editor } from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";
import "../app/App.jsx";
import "../monaco";

export default function Workspace() {
  const editorRef = useRef(null);
  const navigate = useNavigate();

  // Extract the ?pin=XXXXXX from the URL
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("pin");

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [users, setUsers] = useState([]);
  const [editorReady, setEditorReady] = useState(false);

  // Initialize Yjs Document
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

    // Connect Yjs to the backend, using the URL PIN as the isolated room name
    const provider = new SocketIOProvider(
      "http://localhost:5000",
      roomId,
      ydoc,
      { autoConnect: true },
    );

    provider.on("status", ({ status }) => {
      console.log("Y-Socket Status:", status);
    });

    // Handle Peer Awareness (Who is in the room)
    const updateUsers = () => {
      const states = Array.from(provider.awareness.getStates().values());
      setUsers(
        states
          .filter((state) => state?.user?.username)
          .map((state) => state.user),
      );
    };

    provider.awareness.setLocalStateField("user", {
      username: user.name,
    });

    updateUsers();
    provider.awareness.on("change", updateUsers);

    // Bind Yjs to Monaco
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
  }, [user, editorReady, yText, ydoc, roomId]);

  if (!user) return null;

  return (
    <main className="h-screen w-full bg-[#06080c] text-white flex overflow-hidden font-sans">
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
              <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-300 uppercase">
                {u.username.charAt(0)}
              </div>
              <span className="text-sm font-medium text-zinc-200 truncate">
                {u.username}
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-auto shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            </div>
          ))}
        </div>
      </aside>

      {/* Right Section: Monaco Editor */}
      <section className="flex-1 flex flex-col bg-[#06080c]">
        {/* Fake VS Code Style File Tab */}
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
