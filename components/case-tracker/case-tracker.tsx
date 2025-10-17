"use client";

import { useEffect } from "react";
import { useCaseStore } from "@/store/case-store";
import { PageHeader } from "./page-header";
import { AlertBanner } from "./alert-banner";
import { CaseFiltersComponent } from "./case-filters";
import { CaseTable } from "./case-table";

export function CaseTracker() {
  const { fetchCases, fetchCountries } = useCaseStore();

  // Fetch data on mount
  useEffect(() => {
    fetchCases();
    fetchCountries();
  }, [fetchCases, fetchCountries]);

  return (
    <>
      <PageHeader />
      <AlertBanner />
      <CaseFiltersComponent />
      <CaseTable />
    </>
  );
}
