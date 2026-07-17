import { WelcomeCard } from "../../../components/dashboard/WelcomeCard";
import { OverviewCards } from "../../../components/dashboard/OverviewCards";
import { QuickActions } from "../../../components/dashboard/QuickActions";
import { RecentActivity } from "../../../components/dashboard/RecentActivity";
import { ProfileCompletion } from "../../../components/dashboard/ProfileCompletion";
import { HealthTip } from "../../../components/dashboard/HealthTip";

export default function DashboardPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <WelcomeCard />

      <OverviewCards />

      <QuickActions />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <RecentActivity />
        <ProfileCompletion />
      </div>

      <HealthTip />
    </div>
  );
}
