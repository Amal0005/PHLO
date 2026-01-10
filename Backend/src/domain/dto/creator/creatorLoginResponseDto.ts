export interface CreatorLoginResponseDto {
  creator: {
    id: string;
    fullName: string;
    email: string;
    role: "creator";
  };
  token: string;
}
