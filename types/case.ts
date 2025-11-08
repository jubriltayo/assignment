export enum ProcessStatus {
  APPLICATION_PREPARATION = "APPLICATION_PREPARATION",
  DOCUMENT_COLLECTION = "DOCUMENT_COLLECTION",
  GOVERNMENT_PROCESSING = "GOVERNMENT_PROCESSING",
  AWAITING_INFORMATION = "AWAITING_INFORMATION",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum CaseType {
  SPONSORED_VISA = "SPONSORED_VISA",
  EOR_VISA = "EOR_VISA",
  FAMILY_VISA = "FAMILY_VISA",
  STUDENT_VISA = "STUDENT_VISA",
}

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
  updatedAt?: string;
}

export interface CaseFilters {
  searchTerm: string;
  caseType: string;
  country: string;
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

// Service Layer Types
export interface CreateCaseInput {
  name: string;
  caseType: CaseType;
  country: string;
  expectedCompletionDate?: string;
}

export interface UpdateCaseInput {
  name?: string;
  processStatus?: ProcessStatus;
  stepsCompleted?: number;
  expectedCompletionDate?: string;
}

export interface CaseStats {
  totalCases: number;
  casesNeedingAction: number;
  completedCases: number;
}

export interface GraphQLCaseFilter {
  searchTerm?: string;
  caseType?: CaseType;
  country?: string;
  processStatus?: ProcessStatus;
}
