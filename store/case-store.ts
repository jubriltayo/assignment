import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { CaseService } from "@/services/case-service";
import type {
  Case,
  CaseFilters,
  CaseStats,
  CreateCaseInput,
  UpdateCaseInput,
} from "@/types/case";

interface CaseStore {
  // State
  cases: Case[];
  selectedCase: Case | null;
  casesNeedingAction: Pick<Case, "id" | "processStatus">[];
  countries: string[];
  caseStats: CaseStats | null;
  filters: CaseFilters;
  isLoading: boolean;
  error: string | null;

  // Actions - Fetch
  fetchCases: () => Promise<void>;
  fetchCaseById: (id: string) => Promise<void>;
  fetchCasesNeedingAction: () => Promise<void>;
  fetchCountries: () => Promise<void>;
  fetchCaseStats: () => Promise<void>;

  // Actions - Mutations
  createCase: (input: CreateCaseInput) => Promise<Case>;
  updateCase: (id: string, input: UpdateCaseInput) => Promise<Case>;
  deleteCase: (id: string) => Promise<void>;

  // Actions - UI State
  setFilters: (filters: Partial<CaseFilters>) => void;
  setSelectedCase: (case_: Case | null) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  cases: [] as Case[],
  selectedCase: null as Case | null,
  casesNeedingAction: [] as Pick<Case, "id" | "processStatus">[],
  countries: [] as string[],
  caseStats: null as CaseStats | null,
  filters: {
    searchTerm: "",
    caseType: "all",
    country: "all",
  } as CaseFilters,
  isLoading: false,
  error: null as string | null,
};

export const useCaseStore = create<CaseStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Fetch all cases with filters
      fetchCases: async () => {
        set({ isLoading: true, error: null });
        try {
          const { filters } = get();
          const cases = await CaseService.getAllCases(filters);
          set({ cases, isLoading: false });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to fetch cases";
          set({ error: errorMessage, isLoading: false });
        }
      },

      // Fetch single case by ID
      fetchCaseById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const case_ = await CaseService.getCaseById(id);
          set({ selectedCase: case_, isLoading: false });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to fetch case";
          set({ error: errorMessage, isLoading: false });
        }
      },

      // Fetch cases needing action
      fetchCasesNeedingAction: async () => {
        try {
          const cases = await CaseService.getCasesNeedingAction();
          set({ casesNeedingAction: cases });
        } catch (error) {
          console.error("Error fetching cases needing action:", error);
          set({ casesNeedingAction: [] });
        }
      },

      // Fetch countries
      fetchCountries: async () => {
        try {
          const countries = await CaseService.getCountries();
          set({ countries });
        } catch (error) {
          console.error("Error fetching countries:", error);
        }
      },

      // Fetch case statistics
      fetchCaseStats: async () => {
        try {
          const stats = await CaseService.getCaseStats();
          set({ caseStats: stats });
        } catch (error) {
          console.error("Error fetching case stats:", error);
        }
      },

      // Create new case
      createCase: async (input: CreateCaseInput) => {
        set({ isLoading: true, error: null });
        try {
          const newCase = await CaseService.createCase(input);

          // Add to cases list
          set((state) => ({
            cases: [newCase, ...state.cases],
            isLoading: false,
          }));

          // Refresh dependent data
          get().fetchCasesNeedingAction();
          get().fetchCaseStats();

          return newCase;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to create case";
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      // Update existing case
      updateCase: async (id: string, input: UpdateCaseInput) => {
        set({ isLoading: true, error: null });
        try {
          const updatedCase = await CaseService.updateCase(id, input);

          // Update in cases list
          set((state) => ({
            cases: state.cases.map((c) => (c.id === id ? updatedCase : c)),
            selectedCase:
              state.selectedCase?.id === id ? updatedCase : state.selectedCase,
            isLoading: false,
          }));

          // Refresh dependent data
          get().fetchCasesNeedingAction();
          get().fetchCaseStats();

          return updatedCase;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to update case";
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      // Delete case
      deleteCase: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await CaseService.deleteCase(id);

          // Remove from cases list
          set((state) => ({
            cases: state.cases.filter((c) => c.id !== id),
            isLoading: false,
          }));

          // Refresh dependent data
          get().fetchCasesNeedingAction();
          get().fetchCaseStats();
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to delete case";
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      // Set filters
      setFilters: (newFilters: Partial<CaseFilters>) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        }));
        // Auto-fetch when filters change
        get().fetchCases();
      },

      // Set selected case
      setSelectedCase: (case_: Case | null) => {
        set({ selectedCase: case_ });
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Reset store
      reset: () => {
        set(initialState);
      },
    }),
    { name: "CaseStore" }
  )
);
