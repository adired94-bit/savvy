"use client";

import { TopBar } from "@/components/layout/top-bar";
import { useVaultStore } from "@/store/vault-store";
import { ConnectionsPanel } from "./connections-panel";
import { DataPanel } from "./data-panel";
import { NotificationsPanel } from "./notifications-panel";
import { ProfileForm } from "./profile-form";

export function SettingsView() {
  const firstName = useVaultStore((s) => s.profile.firstName);
  return (
    <div className="space-y-6 lg:space-y-8">
      <TopBar firstName={firstName} title="הגדרות" />
      <div className="grid items-start gap-5 xl:grid-cols-2">
        <div className="space-y-5">
          <ProfileForm />
          <NotificationsPanel />
          <DataPanel />
        </div>
        <ConnectionsPanel />
      </div>
    </div>
  );
}
