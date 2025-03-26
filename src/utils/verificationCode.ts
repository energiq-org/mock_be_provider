import crypto from "crypto";

function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export { generateOTP };
