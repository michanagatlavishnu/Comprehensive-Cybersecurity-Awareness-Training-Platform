import { useState } from "react";
import { Save, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "react-i18next";

export default function ProfileSettingsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const updateProfile = async () => {
    setSaving(true);
    setMessage("");
    try {
      await api.put("/users/profile", { full_name: fullName });
      setMessage(t("profileUpdated"));
    } catch (error: any) {
      setMessage(error?.response?.data?.detail || t("profileUpdateFailed"));
    } finally {
      setSaving(false);
    }
  };

  const updatePassword = async () => {
    setSaving(true);
    setMessage("");
    try {
      await api.post("/users/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setMessage(t("passwordUpdated"));
    } catch (error: any) {
      setMessage(error?.response?.data?.detail || t("passwordUpdateFailed"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl space-y-6">
      <header className="rounded-3xl border border-emerald-500/20 bg-slate-900 p-8">
        <div className="flex items-center gap-4">
          <ShieldCheck className="text-emerald-400" size={34} />
          <div><h1 className="text-3xl font-black">{t("profile")}</h1><p className="text-slate-400">{t("profileSettings")}</p></div>
        </div>
      </header>

      <section className="rounded-2xl border border-white/10 bg-slate-900 p-6">
        <h2 className="text-xl font-bold">{t("personalDetails")}</h2>
        <p className="mt-1 text-sm text-slate-400">{user?.email}</p>
        <input value={fullName} onChange={(event) => setFullName(event.target.value)} className="mt-5 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder={t("fullName")} />
        <button onClick={updateProfile} disabled={saving} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 disabled:opacity-50"><Save size={17} /> {t("saveProfile")}</button>
      </section>

      <section className="rounded-2xl border border-white/10 bg-slate-900 p-6">
        <h2 className="text-xl font-bold">{t("password")}</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder={t("currentPassword")} />
          <input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder={t("newPassword")} />
        </div>
        <button onClick={updatePassword} disabled={saving || !currentPassword || !newPassword} className="mt-4 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 disabled:opacity-50">{t("updatePassword")}</button>
        <Link to="/forgot-password" className="ml-4 text-sm text-cyan-300 hover:text-cyan-200">{t("forgotPasswordQuestion")}</Link>
      </section>

      {message && <p className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 p-4 text-cyan-200">{message}</p>}
    </main>
  );
}