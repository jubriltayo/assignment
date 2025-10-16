import client from "@/lib/apollo-client";
import {
  GET_ALL_CASES,
  GET_CASES_NEEDING_ACTION,
  CREATE_CASE_MUTATION,
  GET_CASE_BY_ID,
  GET_COUNTRIES,
  GET_CASE_STATS,
  UPDATE_CASE,
  DELETE_CASE,
} from "@/graphql/queries";
import type {
  Case,
  CaseFilters,
  CreateCaseInput,
  UpdateCaseInput,
  CaseStats,
  GraphQLCaseFilter,
  CaseType,
} from "@/types/case";
import { ApolloError } from "@apollo/client";

// Service Layer
export class CaseService {
  static async getAllCases(filter?: Partial<CaseFilters>): Promise<Case[]> {
    try {
      const graphqlFilter: GraphQLCaseFilter = {};

      if (filter?.searchTerm) {
        graphqlFilter.searchTerm = filter.searchTerm;
      }

      if (filter?.caseType && filter.caseType !== "all") {
        graphqlFilter.caseType = filter.caseType as CaseType;
      }

      if (filter?.country && filter.country !== "all") {
        graphqlFilter.country = filter.country;
      }

      const { data } = await client.query<{ cases: Case[] }>({
        query: GET_ALL_CASES,
        variables: {
          filter:
            Object.keys(graphqlFilter).length > 0 ? graphqlFilter : undefined,
          limit: 100,
          offset: 0,
        },
        fetchPolicy: "network-only",
      });

      return data.cases;
    } catch (error) {
      console.error("Error fetching cases:", error);
      throw this.handleError(error);
    }
  }

  static async getCaseById(id: string): Promise<Case> {
    try {
      const { data } = await client.query<{ case: Case }>({
        query: GET_CASE_BY_ID,
        variables: { id },
        fetchPolicy: "network-only",
      });
      return data.case;
    } catch (error) {
      console.error("Error fetching case:", error);
      throw this.handleError(error);
    }
  }

  static async getCasesNeedingAction(): Promise<
    Pick<Case, "id" | "processStatus">[]
  > {
    try {
      const { data } = await client.query<{
        casesNeedingAction: Pick<Case, "id" | "processStatus">[];
      }>({
        query: GET_CASES_NEEDING_ACTION,
        fetchPolicy: "network-only",
      });
      return data.casesNeedingAction;
    } catch (error) {
      console.error("Error fetching cases needing action:", error);
      throw this.handleError(error);
    }
  }

  static async getCountries(): Promise<string[]> {
    try {
      const { data } = await client.query<{ countries: string[] }>({
        query: GET_COUNTRIES,
        fetchPolicy: "cache-first",
      });
      return data.countries;
    } catch (error) {
      console.error("Error fetching countries:", error);
      throw this.handleError(error);
    }
  }

  static async getCaseStats(): Promise<CaseStats> {
    try {
      const { data } = await client.query<{ caseStats: CaseStats }>({
        query: GET_CASE_STATS,
        fetchPolicy: "network-only",
      });
      return data.caseStats;
    } catch (error) {
      console.error("Error fetching case stats:", error);
      throw this.handleError(error);
    }
  }

  static async createCase(input: CreateCaseInput): Promise<Case> {
    try {
      const { data } = await client.mutate<{ createCase: Case }>({
        mutation: CREATE_CASE_MUTATION,
        variables: { input },
        refetchQueries: [{ query: GET_ALL_CASES }],
      });

      if (!data?.createCase) {
        throw new Error("Failed to create case");
      }

      return data.createCase;
    } catch (error) {
      console.error("Error creating case:", error);
      throw this.handleError(error);
    }
  }

  static async updateCase(id: string, input: UpdateCaseInput): Promise<Case> {
    try {
      const { data } = await client.mutate<{ updateCase: Case }>({
        mutation: UPDATE_CASE,
        variables: { id, input },
        refetchQueries: [
          { query: GET_ALL_CASES },
          { query: GET_CASE_BY_ID, variables: { id } },
        ],
      });

      if (!data?.updateCase) {
        throw new Error("Failed to update case");
      }

      return data.updateCase;
    } catch (error) {
      console.error("Error updating case:", error);
      throw this.handleError(error);
    }
  }

  static async deleteCase(id: string): Promise<boolean> {
    try {
      const { data } = await client.mutate<{ deleteCase: boolean }>({
        mutation: DELETE_CASE,
        variables: { id },
        refetchQueries: [{ query: GET_ALL_CASES }],
      });

      return data?.deleteCase ?? false;
    } catch (error) {
      console.error("Error deleting case:", error);
      throw this.handleError(error);
    }
  }

  private static handleError(error: unknown): Error {
    if (error instanceof ApolloError) {
      return new Error(error.message);
    }
    if (error instanceof Error) {
      return error;
    }
    return new Error("An unknown error occurred");
  }
}
