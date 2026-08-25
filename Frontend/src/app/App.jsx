import "./App.css";
import { Editor } from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import { useRef, useMemo, useState } from "react";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";

function App() {
  const editorRef = useRef(null);

  const [username, setUsername] = useState(() => {
    return new URLSearchParams(window.location.search).get("username") || "";
  });

  const [usernameInput, setUsernameInput] = useState("");

  const ydoc = useMemo(() => new Y.Doc());
  const yText = useMemo(() => ydoc.getText("monaco"), [ydoc]);

  const handleMount = (editor) => {
    editorRef.current = editor;

    const provider = new SocketIOProvider(
      "http://localhost:5000",
      "monaco",
      ydoc,
      {
        autoConnect: true,
      }
    );

    provider.on("status", ({ status }) => {
      console.log("Y-Socket status:", status);
    });

    provider.on("sync", (isSynced) => {
      console.log("Y-Socket synced:", isSynced);
    });

    provider.on("connection-error", (error) => {
      console.error("Y-Socket connection error:", error);
    });

    const monacoBinding = new MonacoBinding(
      yText,
      editor.getModel(),
      new Set([editor]),
      provider.awareness
    );
  };

  const handleJoin = (e) => {
    e.preventDefault();

    setUsername(usernameInput);

    window.history.pushState(
      {},
      "",
      "?username=" + encodeURIComponent(usernameInput)
    );
  };

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
      <aside className="h-full w-1/4 bg-amber-50 rounded-lg"></aside>

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