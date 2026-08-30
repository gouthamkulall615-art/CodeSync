import "../app/App.jsx";
import "../monaco";
import { Editor } from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import { useRef, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";

function Workspace() {
  const editorRef = useRef(null);
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

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
    if (!user?.name || !editorReady || !editorRef.current) {
      return;
    }

    const provider = new SocketIOProvider(
      "http://localhost:5000",
      "monaco",
      ydoc,
      {
        autoConnect: true,
      },
    );

    provider.on("status", ({ status }) => {
      console.log("Y-Socket:", status);
    });

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
  }, [user, editorReady, yText, ydoc]);

  if (!user) return null;

  return (
    <main className="h-screen w-full bg-[#09090B] flex gap-4 p-4">
      <aside className="h-full w-1/4 bg-[#18181B] border border-zinc-800 rounded-lg p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-white">Active Peers</h2>
          <span className="bg-blue-600 text-white text-sm font-semibold px-2 py-1 rounded-full">
            {users.length}
          </span>
        </div>

        <div className="border-t border-zinc-800 pt-3">
          {users.map((u, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 mb-2 rounded-lg bg-zinc-950 border border-zinc-800 shadow-sm"
            >
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-zinc-300 font-medium">{u.username}</span>
            </div>
          ))}
        </div>
      </aside>

      <section className="w-3/4 bg-black border border-zinc-800 rounded-lg overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="c"
          defaultValue="// Write your C logic here..."
          theme="vs-dark"
          onMount={handleMount}
        />
      </section>
    </main>
  );
}

export default Workspace;
