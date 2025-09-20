import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@apollo/client";
import { GET_CASES_NEEDING_ACTION } from "@/graphql/queries";

export function AlertBanner() {
  const { loading, error, data } = useQuery(GET_CASES_NEEDING_ACTION);
  const actionsCount = data?.casesNeedingAction?.length || 0;

  if (loading) return null;
  if (error) return null;
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
