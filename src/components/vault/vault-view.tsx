"use client";

import { TopBar } from "@/components/layout/top-bar";
import { useVaultStore } from "@/store/vault-store";
import { AuditLog } from "./audit-log";
import { EncryptionPanel } from "./encryption-panel";
import { PermissionsPanel } from "./permissions-panel";
import { PoaCard } from "./poa-card";

export function VaultView() {
  const firstName = useVaultStore((s) => s.profile.firstName);
  return (
    <div className="space-y-6 lg:space-y-8">
      <TopBar firstName={firstName} title="הכספת שלך" />
      <PoaCard />
      <div className="grid items-start gap-5 xl:grid-cols-2">
        <PermissionsPanel />
        <div className="space-y-5">
          <EncryptionPanel />
          <AuditLog />
        </div>
      </div>
    </div>
  );
}
