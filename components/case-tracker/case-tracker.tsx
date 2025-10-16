"use client";

import { useEffect, useMemo } from "react";
import { useCaseStore } from "@/store/case-store";
import { PageHeader } from "./page-header";
import { AlertBanner } from "./alert-banner";
import { CaseFiltersComponent } from "./case-filters";
import { CaseTable } from "./case-table";

const formatCaseType = (caseType: string): string => {
  const caseTypeMap: { [key: string]: string } = {
    SPONSORED_VISA: "Sponsored Visa",
    EOR_VISA: "EOR Visa",
    FAMILY_VISA: "Family Visa",
    STUDENT_VISA: "Student Visa",
  };
  return caseTypeMap[caseType] || caseType;
};

export function CaseTracker() {
  const {
    cases,
    filters,
    countries,
    isLoading,
    error,
    fetchCases,
    fetchCountries,
    setFilters,
  } = useCaseStore();

  // Fetch data on mount
  useEffect(() => {
    fetchCases();
    fetchCountries();
  }, [fetchCases, fetchCountries]);

  // Get case types from loaded cases
  const caseTypes = useMemo(() => {
    if (!cases.length) return [];
    const uniqueTypes = [
      ...new Set(cases.map((case_) => formatCaseType(case_.caseType))),
    ];
    return uniqueTypes.sort();
  }, [cases]);

  return (
    <>
      <PageHeader />
      <AlertBanner />
      <CaseFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        countries={countries}
        caseTypes={caseTypes}
        loading={isLoading}
      />
      <CaseTable
        cases={cases}
        loading={isLoading}
        error={error ? { message: error } : undefined}
      />
    </>
  );
}
