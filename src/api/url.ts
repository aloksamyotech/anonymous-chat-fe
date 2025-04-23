export const api_url = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  verifyToken: {
    verify: "auth/verify",
  },
  user: {
    login: "user/login/",
    verifyOtp: "user/verify-otp/",
  },
};
