import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const user = await login(form);
      if (user.role !== "admin") {
        await logout();
        toast.error("This login is restricted to Admins.");
        return;
      }
      toast.success(`Welcome back, ${user.full_name}.`);
      navigate("/admin/dashboard", { replace: true });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Invalid Admin credentials.");
    } finally {
      setLoading(false);
    }
  };

  return <AuthShell title="Admin Login" subtitle="Secure access to the CyberAware control center."><form onSubmit={submit} className="space-y-4"><input required type="email" placeholder="Admin email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white" /><input required type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white" /><button disabled={loading} className="w-full rounded-xl bg-emerald-400 py-3 font-bold text-slate-950 disabled:opacity-50">{loading ? "Signing in..." : "Sign in as Admin"}</button></form><p className="mt-5 text-center text-sm text-slate-400">Initial setup? <Link to="/admin/signup" className="text-emerald-300">Create Admin</Link></p></AuthShell>;
}

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) { return <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4"><section className="w-full max-w-md rounded-3xl border border-emerald-500/20 bg-slate-900 p-8"><ShieldCheck className="mx-auto text-emerald-400" size={42} /><h1 className="mt-5 text-center text-3xl font-black text-white">{title}</h1><p className="mt-2 mb-7 text-center text-slate-400">{subtitle}</p>{children}</section></main>; }
