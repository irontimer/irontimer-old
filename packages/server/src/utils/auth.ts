import admin from "firebase-admin";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { UserRecord } from "firebase-admin/lib/auth/user-record";

export async function verifyIDToken(idToken: string): Promise<DecodedIdToken> {
  return await admin.auth().verifyIdToken(idToken, true);
}

export async function updateUserEmail(
  userID: string,
  email: string
): Promise<UserRecord> {
  return await admin.auth().updateUser(userID, {
    email,
    emailVerified: false
  });
}
