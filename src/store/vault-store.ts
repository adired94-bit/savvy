import { create } from "zustand";
import { mockAccounts, mockAudit, mockNotifications, mockProfile } from "@/lib/mock/vault";
import { addMonths } from "@/lib/vault/poa";
import type {
  AuditEntry,
  Capability,
  ConnectedAccount,
  NotificationChannel,
  NotificationEvent,
  NotificationPrefs,
  PoaGrant,
  Profile,
} from "@/types/vault";
import type { ClaimTopic } from "@/types/claims";

const ALL_TOPICS: ClaimTopic[] = ["telecom", "insurance", "banking", "flight", "product", "subscription"];
const ALL_CAPS: Capability[] = ["send_letters", "negotiate", "receive_replies", "request_refunds"];

interface VaultState {
  poa: PoaGrant;
  audit: AuditEntry[];
  profile: Profile;
  accounts: ConnectedAccount[];
  notifications: NotificationPrefs;

  setTopics: (topics: ClaimTopic[]) => void;
  toggleCapability: (c: Capability) => void;
  setRequireApproval: (v: boolean) => void;
  setValidity: (m: PoaGrant["validityMonths"]) => void;
  /** Called by the signing wizard once the user has verified and signed. */
  signPoa: (signatureDataUrl: string) => void;
  /** One-tap revoke: takes effect immediately. */
  revokePoa: () => void;

  updateProfile: (p: Partial<Profile>) => void;
  toggleAccount: (id: string) => void;
  setNotification: (e: NotificationEvent, c: NotificationChannel, v: boolean) => void;
}

const entry = (kind: AuditEntry["kind"], text: string): AuditEntry => ({ id: `${kind}_${Date.now()}`, kind, text, at: new Date().toISOString() });

export const useVaultStore = create<VaultState>((set) => ({
  poa: { status: "none", topics: ALL_TOPICS, capabilities: ALL_CAPS, requireApproval: true, validityMonths: 12 },
  audit: mockAudit,
  profile: mockProfile,
  accounts: mockAccounts,
  notifications: mockNotifications,

  setTopics: (topics) => set((s) => ({ poa: { ...s.poa, topics } })),
  toggleCapability: (c) =>
    set((s) => ({
      poa: { ...s.poa, capabilities: s.poa.capabilities.includes(c) ? s.poa.capabilities.filter((x) => x !== c) : [...s.poa.capabilities, c] },
    })),
  setRequireApproval: (v) => set((s) => ({ poa: { ...s.poa, requireApproval: v } })),
  setValidity: (m) => set((s) => ({ poa: { ...s.poa, validityMonths: m } })),

  signPoa: (signatureDataUrl) =>
    set((s) => {
      const now = new Date();
      return {
        poa: {
          ...s.poa,
          status: "active",
          signedAt: now.toISOString(),
          expiresAt: addMonths(now, s.poa.validityMonths).toISOString(),
          revokedAt: undefined,
          signatureDataUrl,
        },
        audit: [entry("grant", "חתמת על ייפוי כוח מוגבל"), ...s.audit],
      };
    }),
  revokePoa: () =>
    set((s) => ({
      poa: { ...s.poa, status: "revoked", revokedAt: new Date().toISOString(), signatureDataUrl: undefined },
      audit: [entry("revoke", "ביטלת את ייפוי הכוח. אנחנו לא פועלים יותר בשמך"), ...s.audit],
    })),

  updateProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),
  toggleAccount: (id) => set((s) => ({ accounts: s.accounts.map((a) => (a.id === id ? { ...a, connected: !a.connected } : a)) })),
  setNotification: (e, c, v) => set((s) => ({ notifications: { ...s.notifications, [e]: { ...s.notifications[e], [c]: v } } })),
}));
