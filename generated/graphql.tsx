import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
};

export type Case = {
  __typename?: 'Case';
  caseType: CaseType;
  country: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  expectedCompletionDate?: Maybe<Scalars['Date']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  processStatus: ProcessStatus;
  stepsCompleted: Scalars['Int']['output'];
  totalSteps: Scalars['Int']['output'];
};

export type CaseFilter = {
  caseType?: InputMaybe<CaseType>;
  country?: InputMaybe<Scalars['String']['input']>;
  processStatus?: InputMaybe<ProcessStatus>;
  searchTerm?: InputMaybe<Scalars['String']['input']>;
};

export type CaseStats = {
  __typename?: 'CaseStats';
  casesNeedingAction: Scalars['Int']['output'];
  completedCases: Scalars['Int']['output'];
  totalCases: Scalars['Int']['output'];
};

export enum CaseType {
  EorVisa = 'EOR_VISA',
  FamilyVisa = 'FAMILY_VISA',
  SponsoredVisa = 'SPONSORED_VISA',
  StudentVisa = 'STUDENT_VISA'
}

export type CreateCaseInput = {
  caseType: CaseType;
  country: Scalars['String']['input'];
  expectedCompletionDate?: InputMaybe<Scalars['Date']['input']>;
  name: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']['output']>;
  createCase: Case;
  deleteCase: Scalars['Boolean']['output'];
  updateCase: Case;
};


export type MutationCreateCaseArgs = {
  input: CreateCaseInput;
};


export type MutationDeleteCaseArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateCaseArgs = {
  id: Scalars['ID']['input'];
  input: UpdateCaseInput;
};

export enum ProcessStatus {
  ApplicationPreparation = 'APPLICATION_PREPARATION',
  Approved = 'APPROVED',
  AwaitingInformation = 'AWAITING_INFORMATION',
  DocumentCollection = 'DOCUMENT_COLLECTION',
  GovernmentProcessing = 'GOVERNMENT_PROCESSING',
  Rejected = 'REJECTED'
}

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']['output']>;
  case?: Maybe<Case>;
  caseStats: CaseStats;
  cases: Array<Case>;
  casesNeedingAction: Array<Case>;
  countries: Array<Scalars['String']['output']>;
};


export type QueryCaseArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCasesArgs = {
  filter?: InputMaybe<CaseFilter>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateCaseInput = {
  expectedCompletionDate?: InputMaybe<Scalars['Date']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  processStatus?: InputMaybe<ProcessStatus>;
  stepsCompleted?: InputMaybe<Scalars['Int']['input']>;
};

export type GetCasesNeedingActionQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCasesNeedingActionQuery = { __typename?: 'Query', casesNeedingAction: Array<{ __typename?: 'Case', id: string, processStatus: ProcessStatus }> };

export type GetAllCasesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllCasesQuery = { __typename?: 'Query', cases: Array<{ __typename?: 'Case', id: string, name: string, caseType: CaseType, country: string, processStatus: ProcessStatus, stepsCompleted: number, totalSteps: number, expectedCompletionDate?: any | null, createdAt: any }> };

export type CreateCaseMutationVariables = Exact<{
  input: CreateCaseInput;
}>;


export type CreateCaseMutation = { __typename?: 'Mutation', createCase: { __typename?: 'Case', id: string, name: string, caseType: CaseType, country: string, processStatus: ProcessStatus, stepsCompleted: number, totalSteps: number, expectedCompletionDate?: any | null, createdAt: any } };


export const GetCasesNeedingActionDocument = gql`
    query GetCasesNeedingAction {
  casesNeedingAction {
    id
    processStatus
  }
}
    `;

/**
 * __useGetCasesNeedingActionQuery__
 *
 * To run a query within a React component, call `useGetCasesNeedingActionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCasesNeedingActionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCasesNeedingActionQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCasesNeedingActionQuery(baseOptions?: Apollo.QueryHookOptions<GetCasesNeedingActionQuery, GetCasesNeedingActionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCasesNeedingActionQuery, GetCasesNeedingActionQueryVariables>(GetCasesNeedingActionDocument, options);
      }
export function useGetCasesNeedingActionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCasesNeedingActionQuery, GetCasesNeedingActionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCasesNeedingActionQuery, GetCasesNeedingActionQueryVariables>(GetCasesNeedingActionDocument, options);
        }
export function useGetCasesNeedingActionSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCasesNeedingActionQuery, GetCasesNeedingActionQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCasesNeedingActionQuery, GetCasesNeedingActionQueryVariables>(GetCasesNeedingActionDocument, options);
        }
export type GetCasesNeedingActionQueryHookResult = ReturnType<typeof useGetCasesNeedingActionQuery>;
export type GetCasesNeedingActionLazyQueryHookResult = ReturnType<typeof useGetCasesNeedingActionLazyQuery>;
export type GetCasesNeedingActionSuspenseQueryHookResult = ReturnType<typeof useGetCasesNeedingActionSuspenseQuery>;
export type GetCasesNeedingActionQueryResult = Apollo.QueryResult<GetCasesNeedingActionQuery, GetCasesNeedingActionQueryVariables>;
export const GetAllCasesDocument = gql`
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

/**
 * __useGetAllCasesQuery__
 *
 * To run a query within a React component, call `useGetAllCasesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllCasesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllCasesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllCasesQuery(baseOptions?: Apollo.QueryHookOptions<GetAllCasesQuery, GetAllCasesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllCasesQuery, GetAllCasesQueryVariables>(GetAllCasesDocument, options);
      }
export function useGetAllCasesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllCasesQuery, GetAllCasesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllCasesQuery, GetAllCasesQueryVariables>(GetAllCasesDocument, options);
        }
export function useGetAllCasesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllCasesQuery, GetAllCasesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllCasesQuery, GetAllCasesQueryVariables>(GetAllCasesDocument, options);
        }
export type GetAllCasesQueryHookResult = ReturnType<typeof useGetAllCasesQuery>;
export type GetAllCasesLazyQueryHookResult = ReturnType<typeof useGetAllCasesLazyQuery>;
export type GetAllCasesSuspenseQueryHookResult = ReturnType<typeof useGetAllCasesSuspenseQuery>;
export type GetAllCasesQueryResult = Apollo.QueryResult<GetAllCasesQuery, GetAllCasesQueryVariables>;
export const CreateCaseDocument = gql`
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
export type CreateCaseMutationFn = Apollo.MutationFunction<CreateCaseMutation, CreateCaseMutationVariables>;

/**
 * __useCreateCaseMutation__
 *
 * To run a mutation, you first call `useCreateCaseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCaseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCaseMutation, { data, loading, error }] = useCreateCaseMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCaseMutation(baseOptions?: Apollo.MutationHookOptions<CreateCaseMutation, CreateCaseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCaseMutation, CreateCaseMutationVariables>(CreateCaseDocument, options);
      }
export type CreateCaseMutationHookResult = ReturnType<typeof useCreateCaseMutation>;
export type CreateCaseMutationResult = Apollo.MutationResult<CreateCaseMutation>;
export type CreateCaseMutationOptions = Apollo.BaseMutationOptions<CreateCaseMutation, CreateCaseMutationVariables>;