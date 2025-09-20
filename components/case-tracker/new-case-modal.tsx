"use client";

import type React from "react";
import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
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
import type { NewCaseModalProps } from "@/types/case";
import { CREATE_CASE_MUTATION, GET_ALL_CASES } from "@/graphql/queries";

const caseTypes = [
  { value: "SPONSORED_VISA", label: "Sponsored Visa" },
  { value: "EOR_VISA", label: "EOR Visa" },
  { value: "FAMILY_VISA", label: "Family Visa" },
  { value: "STUDENT_VISA", label: "Student Visa" },
];

const countries = getNames().sort();

const getTotalStepsByCaseType = (caseType: string): number => {
  const stepsMap: { [key: string]: number } = {
    SPONSORED_VISA: 5,
    EOR_VISA: 4,
    FAMILY_VISA: 6,
    STUDENT_VISA: 3,
  };
  return stepsMap[caseType] || 3;
};

export function NewCaseModal({
  isOpen,
  onClose,
  onSuccess,
}: NewCaseModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    caseType: "",
    country: "",
    expectedCompletionDate: undefined as Date | undefined,
  });

  const [createCase, { loading: isSubmitting, error }] = useMutation(
    CREATE_CASE_MUTATION,
    {
      refetchQueries: [{ query: GET_ALL_CASES }],
      onCompleted: () => {
        handleClose();
        onSuccess?.();
      },
      onError: (error) => {
        console.error("Error creating case:", error);
      },
    }
  );

  const handleInputChange = (
    field: string,
    value: string | Date | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.caseType || !formData.country) {
      return;
    }

    const totalSteps = getTotalStepsByCaseType(formData.caseType);

    // Calculate expected completion date if not provided (30 days from now)
    const expectedDate =
      formData.expectedCompletionDate ||
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    try {
      await createCase({
        variables: {
          input: {
            name: formData.name,
            caseType: formData.caseType,
            country: formData.country,
            expectedCompletionDate: expectedDate.toISOString().split("T")[0],
          },
        },
      });
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      caseType: "",
      country: "",
      expectedCompletionDate: undefined,
    });
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
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="caseType">Case Type *</Label>
              <Select
                value={formData.caseType}
                onValueChange={(value) => handleInputChange("caseType", value)}
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
              <p className="text-sm text-red-700 mt-1">
                {error.message || "Something went wrong. Please try again."}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "Creating Case..." : "Create Case"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
