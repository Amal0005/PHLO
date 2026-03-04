export type CreatorLoginResponseDto =
  | {
    status: "approved";
    creator: {
      id: string;
      fullName: string;
      email: string;
      role: "creator";
      subscription?: {
        planId: string;
        planName: string;
        status: "active" | "expired" | "cancelled";
        startDate: string | Date;
        endDate: string | Date;
        stripeSessionId?: string;
      };
    };
    token: string;
    refreshToken?: string;
  }
  | {
    status: "pending";
    message: string;
  }
  | {
    status: "rejected";
    message: string;
    reason?: string;
  };
