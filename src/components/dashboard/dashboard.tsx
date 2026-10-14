"use client";

import { TopBar } from "@/components/layout/top-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "@/hooks/use-dashboard";
import { formatCurrency } from "@/lib/format";
import { ActiveNegotiations } from "./active-negotiations";
import { AnomalyActionCard } from "./anomaly-action-card";
import { CategoryBreakdown } from "./category-breakdown";
import { RecentActivity } from "./recent-activity";
import { SavingsHero } from "./savings-hero";
import { SavingsTrend } from "./savings-trend";

function DashboardSkeleton() {
  return (
    <div className="grid gap-5 xl:grid-cols-12">
      <Skeleton className="h-80 xl:col-span-8" />
      <Skeleton className="h-80 xl:col-span-4" />
      <Skeleton className="h-72 xl:col-span-7" />
      <Skeleton className="h-72 xl:col-span-5" />
    </div>
  );
}

export function Dashboard() {
  const { data, isPending } = useDashboard();
  const openCases = data?.negotiations.filter((n) => n.stage !== "resolved").length ?? 0;

  return (
    <div className="space-y-6 lg:space-y-8">
      <TopBar
        firstName={data?.user.firstName}
        title={
          data ? (
            <>
              חסכנו לך <span className="num text-money">{formatCurrency(data.savings.month)}</span> החודש
            </>
          ) : (
            "\u00a0"
          )
        }
      />

      {isPending || !data ? (
        <DashboardSkeleton />
      ) : (
        <>
          <div className="grid gap-5 xl:grid-cols-12">
            <div className="xl:col-span-8">
              <SavingsHero savings={data.savings} openCases={openCases} />
            </div>
            <div className="xl:col-span-4">
              {data.anomalies[0] && <AnomalyActionCard anomaly={data.anomalies[0]} />}
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <CategoryBreakdown categories={data.categories} />
            </div>
            <div className="xl:col-span-5">
              <SavingsTrend trend={data.trend} />
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-12">
            <div className="xl:col-span-8">
              <ActiveNegotiations negotiations={data.negotiations} />
            </div>
            <div className="xl:col-span-4 xl:pt-[3.25rem]">
              <RecentActivity items={data.activity} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
