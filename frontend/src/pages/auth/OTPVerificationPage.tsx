import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function OTPVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // signup OR reset-password
  const purpose =
    location.state?.purpose || "register";

  useEffect(() => {
    const storedEmail =
      location.state?.email ||
      localStorage.getItem("reset_email") ||
      localStorage.getItem("signup_email") ||
      "";

    setEmail(storedEmail);

    if (purpose !== "reset-password") {
      const developmentOtp = localStorage.getItem("signup_otp");
      if (developmentOtp) {
        setOtp(developmentOtp);
      }
    }
  }, [location.state]);

  const verifyOTP = async () => {
    try {
      setLoading(true);

      // -----------------------------------------
      // Forgot Password OTP
      // -----------------------------------------
      if (purpose === "reset-password") {
        await api.post("/auth/verify-reset-otp", {
          email,
          otp,
        });

        localStorage.setItem("reset_otp", otp);

        navigate("/reset-password");
      }

      // -----------------------------------------
      // Registration OTP
      // -----------------------------------------
      else {
        const response = await api.post("/auth/verify-otp", {
          email,
          otp,
        });

        const data = response.data.data;

        localStorage.setItem(
          "access_token",
          data.access_token
        );
        localStorage.setItem(
          "refresh_token",
          data.refresh_token
        );

        localStorage.setItem("user", JSON.stringify(data.user));

        navigate(data.user?.role === "admin" ? "/admin/dashboard" : "/dashboard");
      }
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          "Invalid OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      let response;
      if (purpose === "reset-password") {
        response = await api.post("/auth/forgot-password", {
          email,
        });
      } else {
        response = await api.post("/auth/resend-otp", {
          email,
        });
      }

      const developmentOtp =
        response?.data?.data?.development_otp;

      if (developmentOtp) {
        localStorage.setItem("signup_otp", developmentOtp);
        setOtp(developmentOtp);
      }

      alert(
        developmentOtp
          ? `Development OTP: ${developmentOtp}`
          : "OTP sent successfully."
      );
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          "Failed to resend OTP."
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-8">
        <h1 className="mb-2 text-center text-3xl font-bold text-white">
          Verify OTP
        </h1>

        <p className="mb-6 text-center text-slate-400">
          Enter the 6-digit OTP sent to
        </p>

        <p className="mb-8 text-center font-semibold text-emerald-400">
          {email}
        </p>

        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) =>
            setOtp(
              e.target.value.replace(/\D/g, "")
            )
          }
          placeholder="Enter OTP"
          className="mb-5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-center text-2xl tracking-[12px] text-white outline-none"
        />

        <button
          onClick={verifyOTP}
          disabled={loading || otp.length !== 6}
          className="w-full rounded-xl bg-emerald-500 py-3 font-semibold text-black hover:bg-emerald-400 disabled:opacity-50"
        >
          {loading
            ? "Verifying..."
            : "Verify OTP"}
        </button>

        <button
          onClick={resendOTP}
          className="mt-4 w-full text-sm text-emerald-400 hover:text-emerald-300"
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
}