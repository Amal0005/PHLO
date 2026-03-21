import { OAuth2Client } from "google-auth-library";
import { MESSAGES } from "@/constants/commonMessages";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleIdToken = async (idToken: string) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload) {
    throw new Error(MESSAGES.AUTH.INVALID_GOOGLE_TOKEN);
  }

  return {
    email: payload.email!,
    name: payload.name!,
    picture: payload.picture,
    googleId: payload.sub!,
  };
};
