import { gql } from "@apollo/client";

// GraphQL Mutation to create Superadmin
export const CREATE_SUPERADMIN = gql`
  mutation CreateSuperadmin($input: SuperadminInput!) {
    createSuperadmin(input: $input) {
      message
      token
      refreshToken
    }
  }
`;
