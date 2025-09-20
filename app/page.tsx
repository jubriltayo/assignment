import { Header } from "@/components/layout/header";
import { Navigation } from "@/components/layout/navigation";
import { CaseTracker } from "@/components/case-tracker/case-tracker";

export default function CaseTrackerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="px-6 py-6">
        <Navigation />
        <CaseTracker />
      </div>
    </div>
  );
}
