import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, ShieldCheck } from "lucide-react";

import api from "../../services/api";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setSuccessMessage("");

      await api.post("/auth/forgot-password", {
        email: email.trim().toLowerCase(),
      });

      // Save email for OTP page
      localStorage.setItem("reset_email", email.trim().toLowerCase());

      setSuccessMessage(
        "Verification OTP has been sent to your email."
      );

      // Small delay so user sees success message
      setTimeout(() => {
        navigate("/verify-otp", {
          state: {
            email: email.trim().toLowerCase(),
            purpose: "reset-password",
          },
        });
      }, 1200);
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Unable to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl">
        {/* Logo */}
        <div className="mb-6 flex flex-col items-center">
          <div className="rounded-2xl bg-gradient-to-br from-emerald-400 to-violet-500 p-3 text-black shadow-lg">
            <ShieldCheck size={28} />
          </div>

          <h1 className="mt-4 text-3xl font-bold text-white">
            Forgot Password
          </h1>

          <p className="mt-2 text-center text-slate-400">
            Enter your registered CyberAware email address.
            We'll send a 6-digit OTP to reset your password.
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-sm text-emerald-400">
            {successMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Email Address
            </label>

            <div className="flex items-center rounded-xl border border-slate-700 bg-slate-800 px-3 transition focus-within:border-emerald-500">
              <Mail
                className="mr-3 text-slate-400"
                size={18}
              />

              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your registered email"
                className="w-full bg-transparent py-3 text-white placeholder:text-slate-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 py-3 font-semibold text-black transition hover:scale-[1.02] hover:from-emerald-300 hover:to-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending OTP..." : "Send Verification OTP"}
          </button>
        </form>

        {/* Back */}
        <button
          onClick={() => navigate("/login")}
          className="mt-6 flex w-full items-center justify-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Login
        </button>
      </div>
    </div>
  );
}