export interface userLoginPayload {
  email: string;
  password: string;
}
export interface UserRegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}
export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ResendOtpPayload {
  email: string;
}