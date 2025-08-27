import twilio from "twilio";

export const initTwilio = (accountSid: string, authToken: string) => {
  const TwillioClient = twilio(accountSid, authToken);
  return TwillioClient;
};
