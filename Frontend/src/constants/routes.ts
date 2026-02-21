export const ROUTES = {
  USER: {
    ROOT: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    VERIFY_OTP: "/verify-otp",
    FORGOT_PASSWORD: "/forgot-password",
    HOME: "/home",
    PROFILE: "/profile",
    PACKAGES: "/packages",
    PACKAGE_DETAIL: "/packages/:packageId",
    PAYMENT_SUCCESS: "/payment-success",
    PAYMENT_CANCEL: "/payment-cancel",

    NOT_FOUND: "*",
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
    PACKAGES: "/creator/packages",
    SUBSCRIPTIONS: "/creator/subscriptions",
    SUBSCRIPTION_SUCCESS: "/creator/subscription-success",
    SUBSCRIPTION_CANCEL: "/creator/subscription-cancel",

  },

  ADMIN: {
    ROOT: "/admin",
    LOGIN: "/admin/login",
    DASHBOARD: "/admin/dashboard",
    USERS: "/admin/users",
    CREATORS: "/admin/creators",
    CATEGORIES: "/admin/category",
    SUBSCRIPTIONS: "/admin/subscription",
  },
};
