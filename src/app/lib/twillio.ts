// Download the helper library from https://www.twilio.com/docs/node/install
import twilio from "twilio";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
export const TwillioClient = twilio(accountSid, authToken);

export async function createMessage() {
  "use server";
  const message = await TwillioClient.messages.create({
    body: "This is the ship that made the Kessel Run in fourteen parsecs?",
    from: "+15077282871",
    to: "+2349161076598",
  });

  console.log(message.body);
}
