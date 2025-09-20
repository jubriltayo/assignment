import { gql } from "@apollo/client";

export const GET_CASES_NEEDING_ACTION = gql`
  query GetCasesNeedingAction {
    casesNeedingAction {
      id
      processStatus
    }
  }
`;

export const GET_ALL_CASES = gql`
  query GetAllCases {
    cases {
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
  }
`;

export const CREATE_CASE_MUTATION = gql`
  mutation CreateCase($input: CreateCaseInput!) {
    createCase(input: $input) {
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
  }
`;
