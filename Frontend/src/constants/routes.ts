export const ROUTES = {
  USER: {
    ROOT: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    VERIFY_OTP: "/verify-otp",
    FORGOT_PASSWORD: "/forgot-password",
    HOME: "/home",
    NOT_FOUND:"*"
  },

  CREATOR: {
    ROOT: "/creator",
    LOGIN: "/creator/login",
    REGISTER: "/creator/register",
    FORGOT_PASSWORD: "/creator/forgot-password",
    DASHBOARD: "/creator/dashboard",
    PROFILE: "/creator/profile",
    CONTENT: "/creator/content",
    ANALYTICS: "/creator/analytics",
  },

  ADMIN: {
    ROOT: "/admin",
    LOGIN: "/admin/login",
    DASHBOARD: "/admin/dashboard",
    USERS: "/admin/users",
    CREATORS: "/admin/creators",
  },
};
