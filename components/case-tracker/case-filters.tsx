"use client";

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
import type { CaseFiltersProps } from "@/types/case";

export function CaseFiltersComponent({
  filters,
  onFiltersChange,
  countries,
  caseTypes,
  loading = false,
}: CaseFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, searchTerm: value });
  };

  const handleCaseTypeChange = (value: string) => {
    onFiltersChange({ ...filters, caseType: value });
  };

  const handleCountryChange = (value: string) => {
    onFiltersChange({ ...filters, country: value });
  };

  const handleClearFilters = () => {
    onFiltersChange({
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
          placeholder="Search"
          value={filters.searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
          disabled={loading}
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
        disabled={loading}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Case Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {caseTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.country}
        onValueChange={handleCountryChange}
        disabled={loading}
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
          disabled={loading}
        >
          Clear Filters
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        className="flex items-center space-x-2 bg-transparent"
        disabled={loading}
      >
        Action Required
      </Button>
    </div>
  );
}
