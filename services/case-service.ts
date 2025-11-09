import client from "@/lib/apollo-client";
import {
  GET_ALL_CASES,
  GET_CASES_NEEDING_ACTION,
  // CREATE_CASE_MUTATION,
  GET_CASE_BY_ID,
  GET_COUNTRIES,
  GET_CASE_STATS,
  // UPDATE_CASE,
  // DELETE_CASE,
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

      const { data, errors } = await client.query<{ cases: Case[] }>({
        query: GET_ALL_CASES,
        variables: {
          filter:
            Object.keys(graphqlFilter).length > 0 ? graphqlFilter : undefined,
          limit: 100,
          offset: 0,
        },
        fetchPolicy: "network-only",
      });

      if (errors && errors.length > 0) {
        console.error("GraphQL errors:", errors);
        throw new Error(errors[0].message);
      }

      if (!data) {
        throw new Error("No data returned from server");
      }

      return data.cases || [];
    } catch (error) {
      console.error("Error fetching cases:", error);
      throw this.handleError(error);
    }
  }

  static async getCaseById(id: string): Promise<Case> {
    try {
      const { data, errors } = await client.query<{ case: Case }>({
        query: GET_CASE_BY_ID,
        variables: { id },
        fetchPolicy: "network-only",
      });

      if (errors && errors.length > 0) {
        console.error("GraphQL errors:", errors);
        throw new Error(errors[0].message);
      }

      if (!data?.case) {
        throw new Error("Case not found");
      }

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
      const { data, errors } = await client.query<{
        casesNeedingAction: Pick<Case, "id" | "processStatus">[];
      }>({
        query: GET_CASES_NEEDING_ACTION,
        fetchPolicy: "network-only",
      });

      if (errors && errors.length > 0) {
        console.error("GraphQL errors:", errors);
        return [];
      }

      return data?.casesNeedingAction || [];
    } catch (error) {
      console.error("Error fetching cases needing action:", error);
      return [];
    }
  }

  static async getCountries(): Promise<string[]> {
    try {
      const { data, errors } = await client.query<{ countries: string[] }>({
        query: GET_COUNTRIES,
        fetchPolicy: "cache-first",
      });

      if (errors && errors.length > 0) {
        console.error("GraphQL errors:", errors);
        return [
          "United States",
          "Canada",
          "United Kingdom",
          "Australia",
          "Germany",
        ];
      }

      return data?.countries || [];
    } catch (error) {
      console.error("Error fetching countries:", error);
      return [
        "United States",
        "Canada",
        "United Kingdom",
        "Australia",
        "Germany",
      ];
    }
  }

  static async getCaseStats(): Promise<CaseStats> {
    try {
      const { data, errors } = await client.query<{ caseStats: CaseStats }>({
        query: GET_CASE_STATS,
        fetchPolicy: "network-only",
      });

      if (errors && errors.length > 0) {
        console.error("GraphQL errors:", errors);
        return {
          totalCases: 0,
          casesNeedingAction: 0,
          completedCases: 0,
        };
      }

      return (
        data?.caseStats || {
          totalCases: 0,
          casesNeedingAction: 0,
          completedCases: 0,
        }
      );
    } catch (error) {
      console.error("Error fetching case stats:", error);
      return {
        totalCases: 0,
        casesNeedingAction: 0,
        completedCases: 0,
      };
    }
  }

  // REST API Calls for Mutations
  static async createCase(input: CreateCaseInput): Promise<Case> {
    try {
      const response = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to create case");
      }

      return result.case;
    } catch (error) {
      console.error("Error creating case:", error);
      throw this.handleError(error);
    }
  }

  static async updateCase(id: string, input: UpdateCaseInput): Promise<Case> {
    try {
      const response = await fetch(`/api/cases/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to update case");
      }

      return result.case;
    } catch (error) {
      console.error("Error updating case:", error);
      throw this.handleError(error);
    }
  }

  static async deleteCase(id: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/cases/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to delete case");
      }

      return true;
    } catch (error) {
      console.error("Error deleting case:", error);
      throw this.handleError(error);
    }
  }

  // NO MORE GRAPHQL DIRECT CALLS TO BACKEND - RATHER WE GO THROUGH REQEUST BODY
  /**
  static async createCase(input: CreateCaseInput): Promise<Case> {
    try {
      const { data, errors } = await client.mutate<{ createCase: Case }>({
        mutation: CREATE_CASE_MUTATION,
        variables: { input },
      });

      if (errors && errors.length > 0) {
        console.error("GraphQL errors:", errors);
        throw new Error(errors[0].message);
      }

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
      const { data, errors } = await client.mutate<{ updateCase: Case }>({
        mutation: UPDATE_CASE,
        variables: { id, input },
      });

      if (errors && errors.length > 0) {
        console.error("GraphQL errors:", errors);
        throw new Error(errors[0].message);
      }

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
      const { data, errors } = await client.mutate<{ deleteCase: boolean }>({
        mutation: DELETE_CASE,
        variables: { id },
      });

      if (errors && errors.length > 0) {
        console.error("GraphQL errors:", errors);
        throw new Error(errors[0].message);
      }

      return data?.deleteCase ?? false;
    } catch (error) {
      console.error("Error deleting case:", error);
      throw this.handleError(error);
    }
  }
  */

  private static handleError(error: unknown): Error {
    if (error instanceof ApolloError) {
      // Extract the first GraphQL error message
      const graphQLError = error.graphQLErrors[0]?.message || error.message;
      return new Error(graphQLError);
    }
    if (error instanceof Error) {
      return error;
    }
    return new Error("An unknown error occurred");
  }
}
