export interface UserXP {
  total_xp: number;
  current_level: number;
  completed_modules: number;
  completed_quizzes: number;
  phishing_reports: number;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  department: string;
  role: "employee" | "admin";
  profile_image?: string;
  awareness_score: number;
  is_verified: boolean;
  is_active: boolean;
  xp: UserXP;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  full_name: string;
  email: string;
  password: string;
  department: string;
}

export interface OTPRequest {
  email: string;
  otp: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: UserProfile;
}

export interface AuthResponse {
  success: boolean;
  message: string;
}