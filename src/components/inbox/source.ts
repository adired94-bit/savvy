import { Camera, FileUp, Mail, type LucideIcon } from "lucide-react";
import type { DocumentSource } from "@/types/inbox";

export const SOURCE_META: Record<DocumentSource, { label: string; icon: LucideIcon }> = {
  gmail: { label: "Gmail", icon: Mail },
  outlook: { label: "Outlook", icon: Mail },
  upload: { label: "הועלה", icon: FileUp },
  camera: { label: "נסרק", icon: Camera },
};
