import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($password: String!, $email: String!) {
    login(password: $password, email: $email)
  }
`;
export const CREATE_USER = gql`
  mutation CreateUser(
    $lastname: String!
    $firstname: String!
    $password: String!
    $email: String!
  ) {
    signup(
      lastname: $lastname
      firstname: $firstname
      password: $password
      email: $email
    ) {
      id
      firstname
      email
      lastname
    }
  }
`;

export const CONFIRM_USER = gql`
  mutation ConfirmUser($token: String!) {
    confirmUser(token: $token)
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($token: String!, $reset: ResetPasswordInput!) {
    resetUserPassword(token: $token, reset: $reset)
  }
`;

export const RESEND_CONFIRMATION = gql`
  mutation ResendMailConfirmation($email: String!) {
    resendMailConfirmation(email: $email)
  }
`;
