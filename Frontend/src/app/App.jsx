import "./App.css";
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

  const ydoc = useMemo(() => new Y.Doc(), []);
  const yText = useMemo(() => ydoc.getText("monaco"), [ydoc]);

  const handleMount = (editor) => {
    editorRef.current = editor;
  };

  const handleJoin = (e) => {
    e.preventDefault();

    const name = usernameInput.trim();

    if (!name) return;

    setUsername(name);

    window.history.pushState({}, "", "?username=" + encodeURIComponent(name));
  };

  useEffect(() => {
    if (!username || !editorRef.current) return;

    const provider = new SocketIOProvider(
      "http://localhost:5000",
      "monaco",
      ydoc,
      {
        autoConnect: true,
      },
    );

    provider.awareness.setLocalStateField("user", {
      username,
    });

    const handleAwarenessChange = () => {
      const states = Array.from(provider.awareness.getStates().values());

      setUsers(
        states
          .filter((state) => state?.user?.username)
          .map((state) => state.user),
      );
    };

    provider.awareness.on("change", handleAwarenessChange);

    const handleBeforeUnload = () => {
      provider.awareness.setLocalStateField("user", null);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    const monacoBinding = new MonacoBinding(
      yText,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      provider.awareness,
    );

    return () => {
      provider.awareness.off("change", handleAwarenessChange);

      window.removeEventListener("beforeunload", handleBeforeUnload);

      provider.awareness.setLocalStateField("user", null);

      monacoBinding.destroy();

      provider.disconnect();

      provider.destroy();

      setUsers([]);
    };
  }, [username, yText, ydoc]);

  if (!username) {
    return (
      <main className="h-screen w-full bg-gray-950 flex gap-4 p-4 items-center justify-center">
        <form onSubmit={handleJoin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="enter your username"
            className="p-2 rounded-lg bg-gray-800 text-white"
            value={usernameInput}
            name="username"
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
      <aside className="h-full w-1/4 bg-amber-50 rounded-lg">
        {users.map((user, index) => (
          <div key={index}>{user.username}</div>
        ))}
      </aside>

      <section className="w-3/4 bg-neutral-800 rounded-lg overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          defaultValue="//some comment"
          theme="vs-dark"
          onMount={handleMount}
        />
      </section>
    </main>
  );
}

export default App;
