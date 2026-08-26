import "./App.css";
import "../monaco";
import { Editor } from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import { useRef, useMemo, useState, useEffect } from "react";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";

function App() {
  const editorRef = useRef(null);

  const [username, setUsername] = useState(() => {
    return new URLSearchParams(window.location.search).get("username") || "";
  });

  const [users, setUsers] = useState([]);
  const [usernameInput, setUsernameInput] = useState("");
  const [editorReady, setEditorReady] = useState(false);

  const ydoc = useMemo(() => new Y.Doc(), []);
  const yText = useMemo(() => ydoc.getText("monaco"), [ydoc]);

  const handleMount = (editor) => {
    editorRef.current = editor;
    setEditorReady(true);
  };

  const handleJoin = (e) => {
    e.preventDefault();

    const name = usernameInput.trim();

    if (!name) return;

    setUsername(name);

    window.history.pushState({}, "", "?username=" + encodeURIComponent(name));
  };

  useEffect(() => {
    if (!username || !editorReady || !editorRef.current) {
      return;
    }

    const provider = new SocketIOProvider(
      "/",
      "monaco",
      ydoc,
      {
        autoConnect: true,
      },
    );

    provider.on("status", ({ status }) => {
      console.log("Y-Socket:", status);
    });

    provider.on("sync", (synced) => {
      console.log("Y-Socket synced:", synced);
    });

    provider.on("connection-error", (error) => {
      console.error("Y-Socket connection error:", error);
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
      username,
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
  }, [username, editorReady, yText, ydoc]);

  if (!username) {
    return (
      <main className="h-screen w-full bg-gray-950 flex items-center justify-center">
        <form onSubmit={handleJoin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter your username"
            className="p-2 rounded-lg bg-gray-800 text-white"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
          />

          <button className="p-2 rounded-lg bg-amber-50 text-gray-950 font-bold">
            JOIN
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="h-screen w-full bg-gray-950 flex gap-4 p-4">
      <aside className="h-full w-1/4 bg-amber-50 rounded-lg p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-950">Online Users</h2>

          <span className="bg-green-100 text-green-700 text-sm font-semibold px-2 py-1 rounded-full">
            {users.length}
          </span>
        </div>

        <div className="border-t border-gray-300 pt-3">
          {users.map((user, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 mb-2 rounded-lg bg-white shadow-sm"
            >
              <div className="w-3 h-3 bg-green-500 rounded-full" />

              <span className="text-gray-950 font-medium">{user.username}</span>
            </div>
          ))}
        </div>
      </aside>

      <section className="w-3/4 bg-neutral-800 rounded-lg overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          defaultValue="// Start coding..."
          theme="vs-dark"
          onMount={handleMount}
        />
      </section>
    </main>
  );
}

export default App;
