"use client";

import type React from "react";
import { useState, forwardRef, useImperativeHandle } from "react";
import { useCaseStore } from "@/store/case-store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { getNames } from "country-list";
import { CaseType, type CreateCaseInput } from "@/types/case";

const caseTypes = [
  { value: CaseType.SPONSORED_VISA, label: "Sponsored Visa" },
  { value: CaseType.EOR_VISA, label: "EOR Visa" },
  { value: CaseType.FAMILY_VISA, label: "Family Visa" },
  { value: CaseType.STUDENT_VISA, label: "Student Visa" },
];

const countries = getNames().sort();

interface FormData {
  name: string;
  caseType: CaseType | "";
  country: string;
  expectedCompletionDate: Date | undefined;
}

export interface NewCaseModalHandle {
  open: () => void;
}

export const NewCaseModal = forwardRef<
  NewCaseModalHandle,
  { onSuccess?: () => void }
>(({ onSuccess }, ref) => {
  const { createCase, isLoading } = useCaseStore();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    caseType: "",
    country: "",
    expectedCompletionDate: undefined,
  });
  const [error, setError] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    open: () => {
      setIsOpen(true);
      setFormData({
        name: "",
        caseType: "",
        country: "",
        expectedCompletionDate: undefined,
      });
      setError(null);
    },
  }));

  const handleInputChange = (
    field: keyof FormData,
    value: string | CaseType | Date | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = e.target.value;
    const date = dateString ? new Date(dateString) : undefined;
    handleInputChange("expectedCompletionDate", date);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.caseType || !formData.country) {
      return;
    }

    setError(null);

    try {
      const input: CreateCaseInput = {
        name: formData.name,
        caseType: formData.caseType as CaseType,
        country: formData.country,
        expectedCompletionDate: formData.expectedCompletionDate
          ?.toISOString()
          .split("T")[0],
      };

      await createCase(input);

      handleClose();
      onSuccess?.();
    } catch (err) {
      console.error("Error creating case:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create case";
      setError(errorMessage);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const isFormValid =
    formData.name.trim() && formData.caseType && formData.country;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Start New Case</DialogTitle>
          <DialogDescription>
            Create a new immigration case. All fields marked with * are
            required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              placeholder="Enter applicant's full name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="caseType">Case Type *</Label>
              <Select
                value={formData.caseType}
                onValueChange={(value: CaseType) =>
                  handleInputChange("caseType", value)
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select case type" />
                </SelectTrigger>
                <SelectContent>
                  {caseTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Destination Country *</Label>
              <Select
                value={formData.country}
                onValueChange={(value) => handleInputChange("country", value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedCompletionDate">
              Expected Completion Date (Optional)
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="expectedCompletionDate"
                type="date"
                value={
                  formData.expectedCompletionDate
                    ? formData.expectedCompletionDate
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={handleDateChange}
                disabled={isLoading}
                min={new Date().toISOString().split("T")[0]}
                className="flex-1"
              />
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              {formData.expectedCompletionDate
                ? `Selected: ${format(formData.expectedCompletionDate, "PPP")}`
                : "If no date is selected, it will default to 30 days from now"}
            </p>
          </div>

          {error && (
            <div className="bg-destructive/15 border border-destructive/50 rounded-lg p-3">
              <p className="text-sm font-medium text-destructive">
                Error creating case
              </p>
              <p className="text-sm text-destructive/90 mt-1">{error}</p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "Creating Case..." : "Create Case"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});

NewCaseModal.displayName = "NewCaseModal";
