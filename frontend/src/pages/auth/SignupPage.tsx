import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import useAuth from "../../hooks/useAuth";

const departments = [
  "Engineering",
  "IT",
  "Finance",
  "Human Resources",
  "Operations",
  "Sales",
  "Marketing",
  "Customer Support",
];

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    department: departments[0],
  });

  const handleSignup = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      form.password.length < 8 ||
      !/[a-z]/.test(form.password) ||
      !/[A-Z]/.test(form.password) ||
      !/\d/.test(form.password) ||
      !/[@$!%*?&]/.test(form.password)
    ) {
      toast.error(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await signup(form);
      const developmentOtp =
        response?.data?.data?.development_otp;

      if (developmentOtp) {
        localStorage.setItem("signup_otp", developmentOtp);
      }

      toast.success(
        "OTP sent to your registered email."
      );

      navigate("/verify-otp", {
        state: { email: form.email },
      });
    } catch (err: any) {
      const validationErrors = err?.response?.data?.errors;
      const validationMessage = Array.isArray(validationErrors)
        ? validationErrors
            .map((item: { msg?: string }) => item.msg)
            .filter(Boolean)
            .join(". ")
        : null;

      toast.error(
        validationMessage ||
          err?.response?.data?.message ||
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020617] px-5">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
      >
        <div className="mb-8 text-center">
          <ShieldCheck
            size={42}
            className="mx-auto text-emerald-400"
          />

          <h1 className="mt-4 text-3xl font-black text-white">
            Create CyberAware Account
          </h1>
        </div>

        <div className="space-y-5">
          <input
            placeholder="Full Name"
            required
            value={form.full_name}
            onChange={(e) =>
              setForm({
                ...form,
                full_name: e.target.value,
              })
            }
            className="input-auth"
          />

          <input
            type="email"
            placeholder="Company Email"
            required
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            className="input-auth"
          />

          <input
            type="password"
            placeholder="Password"
            required
            minLength={8}
            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}"
            title="At least 8 characters with uppercase, lowercase, number, and special character"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
            className="input-auth"
          />

          <select
            value={form.department}
            onChange={(e) =>
              setForm({
                ...form,
                department: e.target.value,
              })
            }
            className="input-auth"
          >
            {departments.map((dept) => (
              <option key={dept}>{dept}</option>
            ))}
          </select>

          <button
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 py-4 font-bold text-black"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Creating Account...
              </>
            ) : (
              "Register"
            )}
          </button>
        </div>

        <div className="mt-6 text-center text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-emerald-400"
          >
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}