export type ProcessStatus =
  | "AWAITING_INFORMATION"
  | "ELIGIBLE"
  | "IN_REVIEW"
  | "APPLICATION_PREPARATION";

export type CaseType =
  | "SPONSORED_VISA"
  | "EOR_VISA"
  | "FAMILY_VISA"
  | "STUDENT_VISA";

export interface Case {
  id: string;
  name: string;
  initials?: string;
  caseType: CaseType;
  country: string;
  countryCode?: string;
  processStatus: ProcessStatus;
  statusColor?: string;
  stepsCompleted: number;
  totalSteps: number;
  expectedCompletionDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CaseFilters {
  searchTerm: string;
  caseType: string;
  country: string;
}

export interface CaseFiltersProps {
  filters: CaseFilters;
  onFiltersChange: (filters: CaseFilters) => void;
  countries: string[];
  caseTypes: string[];
  loading?: boolean;
}

interface ApiError {
  message: string;
  code?: number;
}

export interface CaseTableProps {
  cases: Case[];
  loading?: boolean;
  error?: ApiError;
}

export interface NewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}