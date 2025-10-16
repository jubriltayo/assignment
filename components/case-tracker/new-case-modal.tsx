"use client";

import type React from "react";
import { useState } from "react";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { getNames } from "country-list";
import { cn } from "@/lib/utils";
import type {
  NewCaseModalProps,
  CaseType,
  CreateCaseInput,
} from "@/types/case";

const caseTypes: Array<{ value: CaseType; label: string }> = [
  { value: "SPONSORED_VISA", label: "Sponsored Visa" },
  { value: "EOR_VISA", label: "EOR Visa" },
  { value: "FAMILY_VISA", label: "Family Visa" },
  { value: "STUDENT_VISA", label: "Student Visa" },
];

const countries = getNames().sort();

interface FormData {
  name: string;
  caseType: CaseType | "";
  country: string;
  expectedCompletionDate: Date | undefined;
}

export function NewCaseModal({
  isOpen,
  onClose,
  onSuccess,
}: NewCaseModalProps) {
  const { createCase, isLoading } = useCaseStore();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    caseType: "",
    country: "",
    expectedCompletionDate: undefined,
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    field: keyof FormData,
    value: string | Date | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
    setFormData({
      name: "",
      caseType: "",
      country: "",
      expectedCompletionDate: undefined,
    });
    setError(null);
    onClose();
  };

  const isFormValid =
    formData.name.trim() && formData.caseType && formData.country;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
                onValueChange={(value) =>
                  handleInputChange("caseType", value as CaseType)
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
            <Label>Expected Completion Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.expectedCompletionDate && "text-muted-foreground"
                  )}
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.expectedCompletionDate ? (
                    format(formData.expectedCompletionDate, "PPP")
                  ) : (
                    <span>Pick a date (defaults to 30 days)</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.expectedCompletionDate}
                  onSelect={(date) =>
                    handleInputChange("expectedCompletionDate", date)
                  }
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800 font-medium">
                Error creating case
              </p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
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
}
