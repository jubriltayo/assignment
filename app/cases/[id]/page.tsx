"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCaseStore } from "@/store/case-store";
import { CaseOverview } from "@/components/case-tracker/case-overview";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function CaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { selectedCase, isLoading, error, fetchCaseById } = useCaseStore();
  const caseId = params.id as string;

  useEffect(() => {
    if (caseId) {
      fetchCaseById(caseId);
    }
  }, [caseId, fetchCaseById]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !selectedCase) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Error Loading Case
          </h2>
          <p className="text-red-700">
            {error ||
              "Case not found. It may have been deleted or the ID is invalid."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Cases
      </Button>
      <CaseOverview case={selectedCase} />
    </div>
  );
}
