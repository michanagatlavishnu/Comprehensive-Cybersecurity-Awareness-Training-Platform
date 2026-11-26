import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ShieldCheck } from "lucide-react";
import api from "../../../services/api";

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const email = localStorage.getItem("reset_email") || "";
  const otp = localStorage.getItem("reset_otp") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/reset-password", {
        email,
        otp,
        new_password: newPassword,
      });

      localStorage.removeItem("reset_email");
      localStorage.removeItem("reset_otp");

      alert("Password reset successful.");

      navigate("/login");
    } catch (error: any) {
      alert(
        error.response?.data?.message || "Password reset failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-8">
        <div className="mb-6 text-center">
          <ShieldCheck className="mx-auto mb-3 text-emerald-400" size={34} />
          <h1 className="text-3xl font-bold text-white">Reset Password</h1>
          <p className="mt-2 text-sm text-slate-400">{email}</p>
        </div>

        <form onSubmit={handleReset} className="space-y-5">
          <div className="flex items-center rounded-xl border border-slate-700 bg-slate-800 px-3">
            <Lock className="mr-3 text-slate-400" size={18} />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-transparent py-3 text-white outline-none"
              required
            />
          </div>

          <div className="flex items-center rounded-xl border border-slate-700 bg-slate-800 px-3">
            <Lock className="mr-3 text-slate-400" size={18} />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-transparent py-3 text-white outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-500 py-3 font-semibold text-black hover:bg-emerald-400"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}