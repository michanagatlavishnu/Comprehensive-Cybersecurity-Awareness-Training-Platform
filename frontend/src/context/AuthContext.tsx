import {
  createContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";

import api from "../services/api";
import ENDPOINTS from "../services/api/endpoints";
import tokenService from "../services/auth/tokenService";

/* ==========================================================
   USER MODEL
========================================================== */

export interface AuthUser {
  id: string;
  full_name: string;
  email: string;

  role: "employee" | "admin";

  company?: string;
  department?: string;
  designation?: string;
  language?: string;

  awareness_score: number;

  is_verified: boolean;
  is_active: boolean;
}

/* ==========================================================
   REQUEST TYPES
========================================================== */

interface LoginPayload {
  email: string;
  password: string;
}

interface SignupPayload {
  full_name: string;
  email: string;
  password: string;
  department: string;
}

interface OTPPayload {
  email: string;
  otp: string;
}

/* ==========================================================
   CONTEXT TYPE
========================================================== */

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;

  login(payload: LoginPayload): Promise<AuthUser>;

  signup(payload: SignupPayload): Promise<void>;

  verifyOTP(payload: OTPPayload): Promise<void>;

  resendOTP(email: string): Promise<void>;

  logout(): Promise<void>;

  refreshProfile(): Promise<void>;
}

export const AuthContext =
  createContext<AuthContextType>({} as AuthContextType);

/* ==========================================================
   PROVIDER
========================================================== */

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  /* ========================================================
      FETCH CURRENT USER
  ======================================================== */

  const refreshProfile = async () => {
    try {
      const response = await api.get("/auth/me");

      const profile = response.data.data;

      setUser(profile);

      localStorage.setItem(
        "user",
        JSON.stringify(profile)
      );
    } catch (error) {
      console.error("Profile fetch failed.", error);

      const status = (error as { response?: { status?: number } })
        .response?.status;

      if (status === 401) {
        setUser(null);
        tokenService.clearTokens();
        localStorage.removeItem("user");
      }
    }
  };

  /* ========================================================
      INITIALIZE APP
  ======================================================== */

  useEffect(() => {
    const initialize = async () => {
      const token = tokenService.getAccessToken();

      if (!token) {
        setLoading(false);
        return;
      }

      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem("user");
        }
      }

      try {
        await refreshProfile();
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  /* ========================================================
      LOGIN
  ======================================================== */

  const login = async (
    payload: LoginPayload
  ): Promise<AuthUser> => {
    const response = await api.post(
      ENDPOINTS.AUTH.LOGIN,
      payload
    );

    const data = response.data.data;

    tokenService.saveTokens(
      data.access_token,
      data.refresh_token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    setUser(data.user);

    return data.user;
  };

  /* ========================================================
      SIGNUP
  ======================================================== */

  const signup = async (payload: SignupPayload) => {
    return api.post(
      ENDPOINTS.AUTH.REGISTER,
      payload
    );
  };

  /* ========================================================
      VERIFY EMAIL OTP
  ======================================================== */

  const verifyOTP = async (payload: OTPPayload) => {
    await api.post(
      ENDPOINTS.AUTH.VERIFY_OTP,
      payload
    );
  };

  /* ========================================================
      RESEND OTP
  ======================================================== */

  const resendOTP = async (email: string) => {
    await api.post(
      ENDPOINTS.AUTH.RESEND_OTP,
      {
        email,
      }
    );
  };

  /* ========================================================
      LOGOUT
  ======================================================== */

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}

    tokenService.clearTokens();

    localStorage.removeItem("user");

    setUser(null);

    window.location.replace("/login");
  };

  /* ========================================================
      PROVIDER
  ======================================================== */

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,

        login,
        signup,

        verifyOTP,
        resendOTP,

        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;