"use client";

import { Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeader } from "@/components/ui/section-header";

export function DataPanel() {
  return (
    <GlassCard>
      <SectionHeader title="הנתונים שלך" subtitle="הם שלך. אפשר לקחת אותם או למחוק אותם." />
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary">
          <Download className="size-4" />
          הורדת כל הנתונים
        </Button>
        <Button variant="secondary" className="border-danger/40 text-danger hover:bg-danger/10">
          <Trash2 className="size-4" />
          מחיקת החשבון
        </Button>
      </div>
    </GlassCard>
  );
}
