import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthShell } from "./AdminLoginPage";
import api from "../../services/api";

export default function AdminSignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: "", email: "", password: "", department: "Administration" });
  const [loading, setLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setLoading(true);
    try {
      await api.post("/auth/admin/register", form);
      localStorage.setItem("signup_email", form.email);
      toast.success("Admin OTP sent to your email.");
      navigate("/verify-otp", { state: { email: form.email, purpose: "admin-register" } });
    } catch (error: any) {
      const message = error?.response?.data?.message || "Admin registration failed.";
      toast.error(message);
      if (message.toLowerCase().includes("admin already exists")) {
        setAdminExists(true);
      }
    } finally { setLoading(false); }
  };

  return <AuthShell title="Create Admin" subtitle="Create the initial CyberAware admin account.">{adminExists ? <div className="space-y-4"><p className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-200">An Admin already exists. Sign in as an Admin and create additional Admins from the Users page.</p><Link to="/admin/login" className="block w-full rounded-xl bg-emerald-400 py-3 text-center font-bold text-slate-950">Go to Admin Login</Link></div> : <form onSubmit={submit} className="space-y-4"><input required minLength={3} placeholder="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white" /><input required type="email" placeholder="Admin email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white" /><input required minLength={8} type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white" /><button disabled={loading} className="w-full rounded-xl bg-emerald-400 py-3 font-bold text-slate-950 disabled:opacity-50">{loading ? "Creating..." : "Create Admin"}</button></form>}<p className="mt-5 text-center text-sm text-slate-400">Already registered? <Link to="/admin/login" className="text-emerald-300">Admin login</Link></p></AuthShell>;
}
