import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignActions } from "../enum/SignActions";
import UserInterface from "../interface/UserInterface";
import PasswordInput from "./PasswordInput";
import { useAuth } from "../hooks/useAuth";
import useFormValidation from "../hooks/useFormValidation";
import {
  emailContainsAt,
  passwordsMatch,
  userAlreadyExists,
  userIsNotConfirmed,
} from "../utils/verifyUserForm";
import { defaultUser } from "../data/default";
import { ErrorField } from "../enum/ErrorField";
import FormInput from "./FormInput";
import { useOnSubmit } from "../hooks/useOnSubmit";
import Card from "./Card";

export default function UserForm({
  action,
  token,
}: {
  action: SignActions;
  token: string | undefined;
}) {
  const {
    errors,
    setErrorMessage,
    resetError,
    isFormInvalid,
    emailInvalid,
    passInvalid,
    setFormInvalid,
    setEmailInvalid,
    setPassInvalid,
  } = useFormValidation();

  const toast = useToast();

  const navigate = useNavigate();

  const [user, setUser]: [UserInterface, Function] = useState(defaultUser);
  const [password, setPassword]: [string, Function] = useState("");
  const [confirmPass, setConfirmPass]: [string, Function] = useState("");

  const [loading, setLoading] = useState(false);

  const {
    login,
    signup,
    forgotPassword,
    resetPassword,
    resendConfirmationMail,
  } = useAuth();

  useEffect(() => {
    setUser({ ...user, password: password });
  }, [password]);

  const onSubmitLogin = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    resetError();
    setFormInvalid(false);
    setLoading(true);
    try {
      if ((await login(user.email, user.password)) === true) {
        navigate("/dashboard");
      } else {
        setFormInvalid(true);
        setErrorMessage(
          ErrorField.form,
          "The email/password you entered is invalid"
        );
      }
    } catch (e) {
      if (e instanceof Error) {
        if (userIsNotConfirmed(e.message)) {
          toast({
            title: e.message,
            description: "Check your mail to confirm user.",
            position: "top",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        } else {
          setFormInvalid(true);
          toast({
            title: "Server error",
            position: "top",
            status: "error",
            duration: null,
            isClosable: true,
          });
        }
      }
    }
    setLoading(false);
  };

  const onSubmitForgot = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    resetError();
    setFormInvalid(false);
    setLoading(true);

    try {
      if (emailContainsAt(user.email)) {
        forgotPassword(user.email);
        setUser(defaultUser);
      }
      toast({
        title: "Reset password mail sent",
        position: "top",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const onSubmitReset = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    resetError();
    setFormInvalid(false);
    setLoading(true);
    try {
      if (token) {
        if (passwordsMatch(password, confirmPass)) {
          const valid = await resetPassword(password, token);
          valid
            ? toast({
                title: "Your password has been updated",
                position: "top",
                status: "success",
                duration: 3000,
                isClosable: true,
              })
            : toast({
                title: "404 not found",
                position: "top",
                status: "error",
                duration: 9000,
                isClosable: true,
              });
          setPassword("");
          setConfirmPass("");
        }
        if (!passwordsMatch(password, confirmPass)) {
          setPassInvalid(true);
          setErrorMessage(ErrorField.password, "Passwords should match");
        }
      }
    } catch (e) {
      setLoading(false);
    }
    setLoading(false);
  };

  const onSubmitSignup = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    resetError();
    setFormInvalid(false);
    setLoading(true);
    try {
      if (
        passwordsMatch(password, confirmPass) &&
        emailContainsAt(user.email)
      ) {
        await signup(user);

        toast({
          title: "New user has been created.",
          position: "top",
          description:
            "We have sent you an confirmation mail, please check you email inbox.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        setUser(defaultUser);
        setPassword("");
        setConfirmPass("");
      }
      if (!passwordsMatch(password, confirmPass)) {
        setPassInvalid(true);
        setErrorMessage(ErrorField.password, "Passwords should match");
      }
      if (!emailContainsAt(user.email)) {
        setEmailInvalid(true);
        setErrorMessage(ErrorField.email, "Email should be containing '@'");
      }
    } catch (e) {
      if (e instanceof Error) {
        if (userAlreadyExists(e.message)) {
          setEmailInvalid(true);
          setErrorMessage(ErrorField.email, e.message);
        } else {
          setFormInvalid(true);
          toast({
            title: "Server error",
            position: "top",
            status: "error",
            duration: null,
            isClosable: true,
          });
        }
      }
    }
    setLoading(false);
  };

  const onSubmitResend = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    resetError();
    setFormInvalid(false);
    setLoading(true);

    try {
      if (emailContainsAt(user.email)) {
        await resendConfirmationMail(user.email);

        toast({
          title: "Confirmation mail resent",
          position: "top",
          description:
            "We have sent you an confirmation mail, please check you email inbox.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setUser(defaultUser);
      }
      if (!emailContainsAt(user.email)) {
        setEmailInvalid(true);
        setErrorMessage(ErrorField.email, "Email should be containing '@'");
      }
    } catch (e) {
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <>
      <Card>
        <FormControl isInvalid={emailInvalid || passInvalid}>
          <Center py="4">
            <Heading as="h3" size="lg">
              {action[0] + action.toLowerCase().slice(1)}
            </Heading>
          </Center>
          {isFormInvalid() && (
            <Center>
              <FormErrorMessage>{errors.form}</FormErrorMessage>
            </Center>
          )}
          {action !== SignActions.reset && (
            <FormInput
              type="email"
              field="email"
              placeholder="Enter email"
              isInvalid={emailInvalid}
              value={user.email}
              error={errors.email}
              onChange={(e) => {
                setUser({ ...user, email: e.target.value });
              }}
            />
          )}
          {action === SignActions.signup && (
            <>
              <FormInput
                field="First name"
                placeholder="Enter your first name"
                value={user.firstname}
                error={"First name is required"}
                onChange={(e) => {
                  setUser({ ...user, firstname: e.target.value });
                }}
              />
              <FormInput
                field="Last name"
                placeholder="Enter your last name"
                value={user.lastname}
                error={"Last name is required"}
                onChange={(e) => {
                  setUser({ ...user, lastname: e.target.value });
                }}
              />
            </>
          )}
          {action !== SignActions.forgot && action !== SignActions.resend && (
            <>
              <FormLabel htmlFor="pass">Password</FormLabel>
              <PasswordInput
                setPassword={setPassword}
                password={password}
                passInvalid={passInvalid}
              />
            </>
          )}
          {(action === SignActions.signup || action === SignActions.reset) && (
            <>
              <FormLabel htmlFor="pass">Confirm password</FormLabel>
              <PasswordInput
                password={confirmPass}
                setConfirmPass={setConfirmPass}
                passInvalid={passInvalid}
              />
            </>
          )}
          {passInvalid && (
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          )}
          {action === SignActions.login && (
            <Button py="2" color="primary.main" variant="link">
              <Link to="/user/forgot">Forgot your password ?</Link>
            </Button>
          )}
          <Center py="2">
            <Button
              margin="3"
              isLoading={loading}
              bg="primary.main"
              _hover={{ background: "hover" }}
              onClick={(e) => {
                switch (action) {
                  case SignActions.signup:
                    onSubmitSignup(e);
                    break;
                  case SignActions.login:
                    onSubmitLogin(e);
                    break;
                  case SignActions.forgot:
                    onSubmitForgot(e);
                    break;
                  case SignActions.reset:
                    onSubmitReset(e);
                    break;
                  case SignActions.resend:
                    onSubmitResend(e);
                    break;
                }
              }}
            >
              Submit
            </Button>
          </Center>
        </FormControl>
      </Card>
      {action === SignActions.signup && (
        <Card margin="3">
          <Button py="2" color="primary.main" variant="link">
            <Link to="/resend">Need to confirm your mail?</Link>
          </Button>
        </Card>
      )}
    </>
  );
}

UserForm.defaultProps = {
  token: null,
};
