import type { ClaimTopic } from "./claims";

export type Capability = "send_letters" | "negotiate" | "receive_replies" | "request_refunds";

export type PoaStatus = "none" | "active" | "revoked";

export interface PoaGrant {
  status: PoaStatus;
  signedAt?: string;
  expiresAt?: string;
  revokedAt?: string;
  /** Subjects the agent may act on. Always a subset of consumer-protection topics. */
  topics: ClaimTopic[];
  capabilities: Capability[];
  /** When true, every outgoing letter waits for the user's tap (default). */
  requireApproval: boolean;
  validityMonths: 3 | 6 | 12;
  /** PNG data URL of the drawn signature. Never leaves the device in the real app. */
  signatureDataUrl?: string;
}

export interface AuditEntry {
  id: string;
  kind: "sent" | "reply" | "read" | "grant" | "revoke" | "key";
  text: string;
  at: string;
}

export interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  /** Last 4 digits only; the full number is never stored in plain text. */
  idLast4: string;
  city: string;
}

export type AccountKind = "email" | "bank" | "card";

export interface ConnectedAccount {
  id: string;
  kind: AccountKind;
  name: string;
  detail?: string;
  connected: boolean;
}

export type NotificationEvent = "anomaly" | "reply" | "credit" | "weekly";
export type NotificationChannel = "push" | "email" | "whatsapp";
export type NotificationPrefs = Record<NotificationEvent, Record<NotificationChannel, boolean>>;
