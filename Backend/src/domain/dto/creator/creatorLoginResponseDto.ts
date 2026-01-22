export type CreatorLoginResponseDto =
  | {
      status: "approved";
      creator: {
        id: string;
        fullName: string;
        email: string;
        role: "creator";
      };
      token: string;
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
