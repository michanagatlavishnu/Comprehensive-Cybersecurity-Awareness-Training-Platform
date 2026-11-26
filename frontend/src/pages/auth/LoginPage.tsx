import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

import useAuth from "../../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  /* ==========================================================
      LOGIN
  ========================================================== */

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!form.email.trim()) {
      toast.error("Email is required.");
      return;
    }

    if (!form.password.trim()) {
      toast.error("Password is required.");
      return;
    }

    setLoading(true);

    try {
      const user = await login(form);

      toast.success(`Welcome back, ${user.full_name}!`);

      if (user.role === "admin") {
        navigate("/admin/dashboard", {
          replace: true,
        });
      } else {
        navigate("/dashboard", {
          replace: true,
        });
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================================
      UI
  ========================================================== */

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020617] px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#10B98122,transparent_40%),radial-gradient(circle_at_bottom_left,#06B6D422,transparent_40%)]" />

      <form
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-black">
            <ShieldCheck size={34} />
          </div>

          <h1 className="text-3xl font-black text-white">
            CyberAware
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Enterprise Cybersecurity Awareness Platform
          </p>
        </div>

        {/* Email */}

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Company Email
            </label>

            <input
              type="email"
              required
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              placeholder="name@company.com"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
            />
          </div>

          {/* Password */}

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                placeholder="Enter password"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 pr-12 text-white outline-none transition focus:border-emerald-400"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-3 text-slate-400 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password */}

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-emerald-400 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 py-3 font-bold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2
                  size={20}
                  className="animate-spin"
                />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </div>

        {/* Footer */}

        <div className="mt-8 border-t border-white/10 pt-5 text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-emerald-400 hover:underline"
          >
            Create Account
          </Link>
        </div>
      </form>
    </div>
  );
}