import { useEffect, useState } from "react";
import { api } from "./api";

export default function App() {
  const [uid, setUid] = useState<string>("");
  const [title, setTitle] = useState("");
  const [todos, setTodos] = useState<any[]>([]);

  async function createUser() {
    const r = await api.post("/users", { email: crypto.randomUUID()+"@ex.com" });
    setUid(r.data.id);
  }

  async function addTodo() {
    await api.post("/todos", { title, userId: uid });
    setTitle("");
    loadTodos();
  }
  
  async function loadTodos() {
    if (!uid) return;
    const r = await api.get(`/todos/${uid}`);
    setTodos(r.data);
  }

  useEffect(() => { if (uid) loadTodos(); }, [uid]);

  return (
    <main style={{ padding: 24 }}>
      <h1>Hello, Raid</h1>
      <button onClick={createUser} disabled={!!uid}>Create User</button>
      {uid && <p>User: {uid}</p>}
      <div style={{ marginTop: 16 }}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="New todo" />
        <button onClick={addTodo} disabled={!uid || !title}>Add</button>
      </div>
      <ul>{todos.map(t => <li key={t.id}>{t.title} {t.done ? "✅" : ""}</li>)}</ul>
    </main>
  );
}