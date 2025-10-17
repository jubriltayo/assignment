"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCaseStore } from "@/store/case-store";

const formatCaseType = (caseType: string): string => {
  const caseTypeMap: { [key: string]: string } = {
    SPONSORED_VISA: "Sponsored Visa",
    EOR_VISA: "EOR Visa",
    FAMILY_VISA: "Family Visa",
    STUDENT_VISA: "Student Visa",
  };
  return caseTypeMap[caseType] || caseType;
};

export function CaseFiltersComponent() {
  const { filters, cases, countries, isLoading, setFilters } = useCaseStore();
  const [localSearchTerm, setLocalSearchTerm] = useState(filters.searchTerm);

  // Get case types from loaded cases
  const caseTypes = useMemo(() => {
    if (!cases.length) return [];
    const uniqueTypes = [...new Set(cases.map((case_) => case_.caseType))];
    return uniqueTypes.sort();
  }, [cases]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localSearchTerm !== filters.searchTerm) {
        setFilters({ searchTerm: localSearchTerm });
      }
    }, 500);

    // cancel the timeout if user types again before 500ms
    return () => clearTimeout(timeoutId);
  }, [localSearchTerm, filters.searchTerm, setFilters]);

  // Sync local state with store when filters change externally (e.g., clear filters)
  useEffect(() => {
    setLocalSearchTerm(filters.searchTerm);
  }, [filters.searchTerm]);

  const handleSearchChange = (value: string) => {
    setLocalSearchTerm(value);
  };

  const handleCaseTypeChange = (value: string) => {
    setFilters({ caseType: value });
  };

  const handleCountryChange = (value: string) => {
    setFilters({ country: value });
  };

  const handleClearFilters = () => {
    setLocalSearchTerm("");
    setFilters({
      searchTerm: "",
      caseType: "all",
      country: "all",
    });
  };

  const hasActiveFilters =
    filters.searchTerm !== "" ||
    filters.caseType !== "all" ||
    filters.country !== "all";

  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search cases..."
          value={localSearchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
          disabled={isLoading}
        />
      </div>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center space-x-2 bg-transparent"
      >
        <Filter className="w-4 h-4" />
        <span>Filter</span>
      </Button>

      <Select
        value={filters.caseType}
        onValueChange={handleCaseTypeChange}
        disabled={isLoading}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Case Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {caseTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {formatCaseType(type)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.country}
        onValueChange={handleCountryChange}
        disabled={isLoading}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Countries</SelectItem>
          {countries.map((country) => (
            <SelectItem key={country} value={country}>
              {country}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button
          variant="secondary"
          size="sm"
          onClick={handleClearFilters}
          disabled={isLoading}
        >
          Clear Filters
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        className="flex items-center space-x-2 bg-transparent"
        disabled={isLoading}
      >
        Action Required
      </Button>
    </div>
  );
}
