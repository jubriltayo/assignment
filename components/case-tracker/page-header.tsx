"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NewCaseModal } from "./new-case-modal";
import { Toast } from "@/components/ui/toast";
import { Plus } from "lucide-react";

export function PageHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; isVisible: boolean }>({
    message: "",
    isVisible: false,
  });

  const handleNewCaseSuccess = () => {
    setToast({
      message: "New case created successfully!",
      isVisible: true,
    });
  };

  const handleCheckEligibility = () => {
    setToast({
      message: "Visa eligibility checker coming soon!",
      isVisible: true,
    });
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Case tracker</h1>
        <div className="flex space-x-3">
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Start new case
          </Button>
          <Button
            variant="outline"
            className="text-gray-600 bg-transparent"
            onClick={handleCheckEligibility}
          >
            Check visa eligibility
          </Button>
        </div>
      </div>

      <NewCaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleNewCaseSuccess}
      />

      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />
    </>
  );
}
