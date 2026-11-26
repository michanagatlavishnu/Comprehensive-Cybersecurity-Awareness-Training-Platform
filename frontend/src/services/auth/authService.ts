import apiClient from "../api";
import ENDPOINTS from "../api/endpoints";
import tokenService from "./tokenService";

import type {
  LoginRequest,
  SignupRequest,
  OTPRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UserProfile,
} from "../../types/auth";

export const authService = {
  async signup(data: SignupRequest) {
    return apiClient.post(ENDPOINTS.AUTH.REGISTER, data);
  },

  async verifyOTP(data: OTPRequest) {
    return apiClient.post(ENDPOINTS.AUTH.VERIFY_OTP, data);
  },

  async resendOTP(email: string) {
    return apiClient.post(ENDPOINTS.AUTH.RESEND_OTP, { email });
  },

  async login(credentials: LoginRequest) {
    const response = await apiClient.post<LoginResponse>(
      ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    tokenService.saveTokens(
      response.access_token,
      response.refresh_token
    );

    tokenService.saveUser(response.user);

    return response;
  },

  async forgotPassword(payload: ForgotPasswordRequest) {
    return apiClient.post(
      ENDPOINTS.AUTH.FORGOT_PASSWORD,
      payload
    );
  },

  async resetPassword(payload: ResetPasswordRequest) {
    return apiClient.post(
      ENDPOINTS.AUTH.RESET_PASSWORD,
      payload
    );
  },

  async getProfile() {
    return apiClient.get<UserProfile>(ENDPOINTS.AUTH.ME);
  },

  async logout() {
    try {
      await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
    } finally {
      tokenService.clearTokens();
    }
  },
};

export default authService;