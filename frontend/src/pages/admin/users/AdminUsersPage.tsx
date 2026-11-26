import { useEffect, useState } from "react";
import api from "../../../services/api";

type User = { id: string; full_name: string; email: string; role: string; department?: string; is_active: boolean; awareness_score?: number };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [adminForm, setAdminForm] = useState({ full_name: "", email: "", password: "" });
  const [adminMessage, setAdminMessage] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/users", { params: { search: search || undefined, limit: 100 } });
      setUsers(response.data.data.items || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, [search]);

  const toggleStatus = async (user: User) => {
    await api.patch(`/admin/users/${user.id}/status`, { is_active: !user.is_active });
    await load();
  };

  const createAdmin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await api.post("/admin/users/admin/register", { ...adminForm, department: "Administration" });
      setAdminForm({ full_name: "", email: "", password: "" });
      setAdminMessage("Admin created. They must verify their email before logging in.");
    } catch (error: any) {
      setAdminMessage(error?.response?.data?.message || "Unable to create admin.");
    }
  };

  return <div className="space-y-6">
    <div><h1 className="text-3xl font-bold text-white">Users</h1><p className="mt-1 text-slate-400">Monitor employee access, roles, and awareness progress.</p></div>
    <form onSubmit={createAdmin} className="grid gap-3 rounded-2xl border border-emerald-500/20 bg-slate-900 p-5 md:grid-cols-[1fr_1fr_1fr_auto]"><input required minLength={3} placeholder="New admin name" value={adminForm.full_name} onChange={(event) => setAdminForm({ ...adminForm, full_name: event.target.value })} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" /><input required type="email" placeholder="New admin email" value={adminForm.email} onChange={(event) => setAdminForm({ ...adminForm, email: event.target.value })} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" /><input required minLength={8} type="password" placeholder="Temporary password" value={adminForm.password} onChange={(event) => setAdminForm({ ...adminForm, password: event.target.value })} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" /><button className="rounded-xl bg-emerald-400 px-4 py-3 font-semibold text-slate-950">Create Admin</button>{adminMessage && <p className="text-sm text-emerald-300 md:col-span-4">{adminMessage}</p>}</form>
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, or department" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400" />
    </div>
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
      <table className="w-full text-left text-sm"><thead className="border-b border-slate-800 text-slate-400"><tr><th className="p-4">User</th><th className="p-4">Role</th><th className="p-4">Department</th><th className="p-4">Awareness</th><th className="p-4">Status</th><th className="p-4">Action</th></tr></thead><tbody>{loading ? <tr><td colSpan={6} className="p-8 text-center text-slate-400">Loading users...</td></tr> : users.map((user) => <tr key={user.id} className="border-b border-slate-800/70"><td className="p-4"><p className="font-semibold text-white">{user.full_name}</p><p className="text-slate-500">{user.email}</p></td><td className="p-4 text-slate-300">{user.role}</td><td className="p-4 text-slate-300">{user.department || "-"}</td><td className="p-4 text-cyan-300">{user.awareness_score ?? 0}%</td><td className="p-4"><span className={user.is_active ? "text-emerald-300" : "text-red-300"}>{user.is_active ? "Active" : "Inactive"}</span></td><td className="p-4"><button onClick={() => void toggleStatus(user)} className="rounded-lg border border-slate-600 px-3 py-2 text-slate-200 hover:border-emerald-400">{user.is_active ? "Deactivate" : "Activate"}</button></td></tr>)}</tbody></table>
    </div>
  </div>;
}
