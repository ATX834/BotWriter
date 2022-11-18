import { gql } from "@apollo/client";

export const GET_SAMPLE_LETTER_BY_SEARCH_TERM = gql`
  query GetSampleLettersBySearchTerm($search: String!) {
    getSampleLettersBySearchTerm(search: $search) {
      id
      title
    }
  }
`;

export const GET_SAMPLE_LETTER_BY_USER = gql`
  query GetSampleLettersByUser($id: ID!) {
    getSampleLetterByUser(id: $id) {
      id
      title
      content
      hooks {
        value
      }
    }
  }
`;

