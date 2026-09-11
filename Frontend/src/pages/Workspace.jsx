import { useRef, useMemo, useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Editor } from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";
import { FiPlay } from "react-icons/fi";
import api from "../api/axios";
import "../app/App.jsx";
import "../monaco";

const CURSOR_COLORS = [
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
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

  const userColor = useMemo(
    () => CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)],
    [],
  );
  const [users, setUsers] = useState([]);
  const [editorReady, setEditorReady] = useState(false);

  const [output, setOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);

  const ydoc = useMemo(() => new Y.Doc(), []);
  const yText = useMemo(() => ydoc.getText("monaco"), [ydoc]);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const handleMount = (editor) => {
    editorRef.current = editor;
    setEditorReady(true);
  };

  useEffect(() => {
    if (!user?.name || !editorReady || !editorRef.current || !roomId) return;

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
          .filter(([clientId, state]) => state?.user?.username)
          .map(([clientId, state]) => ({ clientId, ...state.user })),
      );
    };

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

    const handleBeforeUnload = () =>
      provider.awareness.setLocalStateField("user", null);
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

  const handleRunCode = async () => {
    if (!editorRef.current) return;

    const sourceCode = editorRef.current.getValue();
    if (!sourceCode.trim()) return;

    setIsExecuting(true);
    setOutput("Compiling and executing on remote server...\n");

    try {
      const response = await api.post("/execute", { code: sourceCode });

      if (response.data.output) {
        setOutput(response.data.output);
      } else {
        setOutput("Program executed successfully with no output.");
      }
    } catch (error) {
      setOutput(
        error.response?.data?.output ||
          "Server connection error. Failed to execute code.",
      );
    } finally {
      setIsExecuting(false);
    }
  };

  if (!user) return null;

  return (
    <main className="h-screen w-full bg-[#06080c] text-white flex overflow-hidden font-sans">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .yRemoteSelectionHead { position: absolute; border-left: 2px solid currentColor; box-sizing: border-box; pointer-events: none; }
        ${users
          .map(
            (u) => `
          .yRemoteSelection-${u.clientId} { background-color: ${u.color}33 !important; }
          .yRemoteSelectionHead-${u.clientId} { border-color: ${u.color} !important; }
          .yRemoteSelectionHead-${u.clientId}::after {
            content: "${u.username}"; position: absolute; top: -18px; left: -2px;
            background-color: ${u.color}; color: #ffffff; font-size: 11px; font-weight: 600;
            padding: 2px 6px; border-radius: 4px; border-bottom-left-radius: 0; white-space: nowrap;
            z-index: 100; pointer-events: none; box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
        `,
          )
          .join("\n")}
      `,
        }}
      />

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

      <section className="flex-1 flex flex-col bg-[#06080c] min-w-0">
        <div className="h-14 border-b border-zinc-800 flex items-center justify-between bg-[#0b0f15] pr-4">
          <div className="h-full px-5 flex items-center border-t-2 border-t-blue-500 bg-[#06080c] border-r border-zinc-800">
            <span className="text-zinc-300 text-sm font-mono">main.c</span>
          </div>

          <button
            onClick={handleRunCode}
            disabled={isExecuting}
            className="flex items-center gap-2 px-4 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-md font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiPlay className={isExecuting ? "animate-pulse" : ""} />
            {isExecuting ? "Executing..." : "Run Code"}
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage="c"
            defaultValue={
              '#include <stdio.h>\n\nint main() {\n    printf("Hello from CodeSync!\\n");\n    return 0;\n}'
            }
            theme="vs-dark"
            onMount={handleMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: "on",
              padding: { top: 16 },
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            }}
          />
        </div>

        <div className="h-[250px] border-t border-zinc-800 bg-[#0b0f15] flex flex-col shrink-0">
          <div className="px-4 py-2 border-b border-zinc-800 flex items-center bg-[#11151c]">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Terminal Output
            </span>
          </div>
          <div className="flex-1 p-4 overflow-y-auto font-mono text-sm text-zinc-300 whitespace-pre-wrap">
            {output ? (
              <span
                className={
                  output.includes("error:") || output.includes("Error")
                    ? "text-red-400"
                    : "text-zinc-300"
                }
              >
                {output}
              </span>
            ) : (
              <span className="text-zinc-600 italic">
                Waiting for execution...
              </span>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
