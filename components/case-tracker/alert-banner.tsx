import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCaseStore } from "@/store/case-store";

export function AlertBanner() {
  const { casesNeedingAction, fetchCasesNeedingAction } = useCaseStore();

  useEffect(() => {
    fetchCasesNeedingAction();
  }, [fetchCasesNeedingAction]);

  const actionsCount = casesNeedingAction.length;

  if (actionsCount === 0) return null;

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <AlertTriangle className="w-5 h-5 text-orange-600" />
        <div>
          <p className="font-medium text-orange-800">
            {actionsCount} action{actionsCount !== 1 ? "s" : ""} required
          </p>
          <p className="text-sm text-orange-700">
            Review cases pending action to unblock them.
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="text-orange-700 border-orange-300 bg-transparent"
      >
        View
      </Button>
    </div>
  );
}
