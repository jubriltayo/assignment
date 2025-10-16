import { gql } from "@apollo/client";

// FRAGMENTS
export const CASE_CORE_FIELDS = gql`
  fragment CaseCoreFields on Case {
    id
    name
    caseType
    country
    processStatus
    stepsCompleted
    totalSteps
    expectedCompletionDate
    createdAt
  }
`;

export const CASE_MINIMAL_FIELDS = gql`
  fragment CaseMinimalFields on Case {
    id
    processStatus
  }
`;

export const CASE_STATS_FIELDS = gql`
  fragment CaseStatsFields on CaseStats {
    totalCases
    casesNeedingAction
    completedCases
  }
`;

// QUERIES
export const GET_CASES_NEEDING_ACTION = gql`
  ${CASE_MINIMAL_FIELDS}

  query GetCasesNeedingAction {
    casesNeedingAction {
      ...CaseMinimalFields
    }
  }
`;

export const GET_ALL_CASES = gql`
  ${CASE_CORE_FIELDS}

  query GetAllCases($filter: CaseFilter, $limit: Int, $offset: Int) {
    cases(filter: $filter, limit: $limit, offset: $offset) {
      ...CaseCoreFields
    }
  }
`;

export const GET_CASE_BY_ID = gql`
  ${CASE_CORE_FIELDS}

  query GetCaseById($id: ID!) {
    case(id: $id) {
      ...CaseCoreFields
    }
  }
`;

export const GET_COUNTRIES = gql`
  query GetCountries {
    countries
  }
`;

export const GET_CASE_STATS = gql`
  ${CASE_STATS_FIELDS}

  query GetCaseStats {
    caseStats {
      ...CaseStatsFields
    }
  }
`;

// MUTATIONS
export const CREATE_CASE_MUTATION = gql`
  ${CASE_CORE_FIELDS}

  mutation CreateCase($input: CreateCaseInput!) {
    createCase(input: $input) {
      ...CaseCoreFields
    }
  }
`;

export const UPDATE_CASE = gql`
  ${CASE_CORE_FIELDS}

  mutation UpdateCase($id: ID!, $input: UpdateCaseInput!) {
    updateCase(id: $id, input: $input) {
      ...CaseCoreFields
    }
  }
`;

export const DELETE_CASE = gql`
  mutation DeleteCase($id: ID!) {
    deleteCase(id: $id)
  }
`;
