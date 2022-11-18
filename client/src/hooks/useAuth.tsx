import React from "react";
import { useMutation, useQuery } from "@apollo/client";
import { createContext, useContext, useEffect, useState } from "react";
import { GET_PROFILE } from "../graphql/queries/User";
import {
  LOGIN,
  CREATE_USER,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  RESEND_CONFIRMATION,
} from "../graphql/mutations/User";
import UserInterface from "../interface/UserInterface";
import { defaultContextUser } from "../data/default";

export const AuthContext = createContext<{
  isLogged: boolean;
  user: UserInterface;
  login: (
    email: string | undefined,
    password: string | undefined
  ) => Promise<boolean>;
  signup: (newUser: UserInterface) => Promise<boolean | Error>;
  forgotPassword: (email: string | undefined) => Promise<boolean | Error>;
  resendConfirmationMail: (
    email: string | undefined
  ) => Promise<boolean | Error>;
  resetPassword: (
    password: string | undefined,
    token: string
  ) => Promise<boolean | Error>;
  signout: () => Promise<void>;
} | null>(null);

export function AuthProvider({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}): JSX.Element {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(defaultContextUser);
  const [doLogin] = useMutation(LOGIN);
  const [doCreateUser] = useMutation(CREATE_USER);
  const [doForgotPassword] = useMutation(FORGOT_PASSWORD);
  const [doResetPassword] = useMutation(RESET_PASSWORD);
  const [doResendConfirmation] = useMutation(RESEND_CONFIRMATION);
  const { refetch } = useQuery(GET_PROFILE);

  const updateContext = async () => {
    const { data } = await refetch();
    if (data) {
      setIsLogged(true);
      setUser({
        email: data?.getProfile.email,
        id: data?.getProfile.id,
        firstname: data.getProfile.firstname,
        lastname: data?.getProfile.lastname,
      });
    }
  };

  useEffect(() => {
    updateContext()
    
  }, [localStorage.getItem("token")]);

  const login = async (
    email: string | undefined,
    password: string | undefined
  ): Promise<boolean> => {
    try {
      const result = await doLogin({
        variables: {
          email: email,
          password: password,
        },
      });

      const token = result.data.login;

      if (token) {
        localStorage.setItem("token", result.data.login);
        const { data } = await refetch();
        if (data) {
          setIsLogged(true);
          setUser({
            email: data?.getProfile.email,
            id: data?.getProfile.id,
            firstname: data?.getProfile.firstname,
            lastname: data?.getProfile.lastname,
          });
        } else {
          setIsLogged(false);
        }
        return true;
      } else {
        return false;
      }
    } catch (e) {
      if (e instanceof Error) {
        throw e;
      }
      return false;
    }
  };

  const signup = async (newUser: UserInterface): Promise<boolean | Error> => {
    try {
      await doCreateUser({
        variables: {
          email: newUser.email,
          password: newUser.password,
          firstname: newUser.firstname,
          lastname: newUser.lastname,
        },
      });
      return true;
    } catch (e) {
      if (e instanceof Error) {
        throw e;
      }
      return false;
    }
  };

  const forgotPassword = async (
    email: string | undefined
  ): Promise<boolean | Error> => {
    try {
      await doForgotPassword({ variables: { email } });
      return true;
    } catch (e) {
      if (e instanceof Error) {
        throw e;
      }
      return false;
    }
  };

  const resetPassword = async (
    password: string | undefined,
    token: string
  ): Promise<boolean | Error> => {
    try {
      const reset = { password };
      const { data } = await doResetPassword({ variables: { token, reset } });
      return data.resetUserPassword ? true : false;
    } catch (e) {
      if (e instanceof Error) {
        throw e;
      }
      return false;
    }
  };

  const resendConfirmationMail = async (
    email: string | undefined
  ): Promise<boolean | Error> => {
    try {
      await doResendConfirmation({ variables: { email } });
      return true;
    } catch (e) {
      if (e instanceof Error) {
        throw e;
      }
      return false;
    }
  };

  const signout = async (): Promise<void> => {
    localStorage.removeItem("token");
    setIsLogged(false);
    setUser(defaultContextUser);
  };

  return (
    <AuthContext.Provider
      value={{
        isLogged,
        user,
        login,
        signup,
        signout,
        forgotPassword,
        resetPassword,
        resendConfirmationMail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const authContext = useContext(AuthContext);
  if (authContext) {
    return authContext;
  } else {
    throw new Error("auth_context_not_set");
  }
}
