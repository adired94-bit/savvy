import type { ClaimStatus } from "@/types/claims";

export const STATUS_META: Record<ClaimStatus, { label: string; tone: "alert" | "info" | "money" | "danger" }> = {
  awaiting_approval: { label: "מחכה לאישור שלך", tone: "alert" },
  sent: { label: "נשלח", tone: "info" },
  in_progress: { label: "בטיפול", tone: "info" },
  resolved: { label: "קיבלת זיכוי", tone: "money" },
  rejected: { label: "נדחה", tone: "danger" },
};

/** The three steps the user sees on every case. */
export const STEPS: { status: "sent" | "in_progress" | "resolved"; label: string }[] = [
  { status: "sent", label: "נשלח" },
  { status: "in_progress", label: "בטיפול" },
  { status: "resolved", label: "התקבל זיכוי" },
];
