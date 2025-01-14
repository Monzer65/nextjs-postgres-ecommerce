import { User } from "./user-types";

export interface SessionFlags {
  twoFactorVerified: boolean;
}

export interface Session extends SessionFlags {
  id: string;
  expiresAt: Date;
  userId: number;
}

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };
