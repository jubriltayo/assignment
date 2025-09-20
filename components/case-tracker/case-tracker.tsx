"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { PageHeader } from "./page-header";
import { AlertBanner } from "./alert-banner";
import { CaseFiltersComponent } from "./case-filters";
import { CaseTable } from "./case-table";
import type { CaseFilters, Case } from "@/types/case";
import { GET_ALL_CASES } from "@/graphql/queries";

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
  const [filters, setFilters] = useState<CaseFilters>({
    searchTerm: "",
    caseType: "all",
    country: "all",
  });

  const { loading, error, data } = useQuery<{ cases: Case[] }>(GET_ALL_CASES);
  // Get filtering options (countries and case types) from data directly,
  // caches them with useMemo,
  // only recalculates when data changes
  const { countries, caseTypes } = useMemo(() => {
    if (!data?.cases) return { countries: [], caseTypes: [] };

    const uniqueCountries = [
      ...new Set(data.cases.map((case_) => case_.country)),
    ];
    const uniqueCaseTypes = [
      ...new Set(data.cases.map((case_) => formatCaseType(case_.caseType))),
    ];

    return {
      countries: uniqueCountries.sort(),
      caseTypes: uniqueCaseTypes.sort(),
    };
  }, [data?.cases]);

  // Filter cases based on the current filters
  const filteredCases = useMemo(() => {
    if (!data?.cases) return [];

    return data.cases.filter((case_) => {
      const matchesSearch = case_.name
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase());
      const matchesCaseType =
        filters.caseType === "all" ||
        formatCaseType(case_.caseType) === filters.caseType;
      const matchesCountry =
        filters.country === "all" || case_.country === filters.country;

      return matchesSearch && matchesCaseType && matchesCountry;
    });
  }, [data?.cases, filters]);

  return (
    <div className="px-6 py-6">
      <PageHeader />
      <AlertBanner />
      <CaseFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        countries={countries}
        caseTypes={caseTypes}
        loading={loading}
      />
      <CaseTable cases={filteredCases} loading={loading} error={error} />
    </div>
  );
}
