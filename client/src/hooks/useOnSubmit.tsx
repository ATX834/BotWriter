import useFormValidation from "./useFormValidation";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";
import { ErrorField } from "../enum/ErrorField";
import {
  emailContainsAt,
  passwordsMatch,
  userAlreadyExists,
} from "../utils/verifyUserForm";
import UserInterface from "../interface/UserInterface";
import { useToast } from "@chakra-ui/react";
import { defaultUser } from "../data/default";

export const useOnSubmit = (setLoading: Function) => {
  const {
    errors,
    setErrorMessage,
    resetError,
    setFormInvalid,
    setEmailInvalid,
    setPassInvalid,
  } = useFormValidation();

  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const onSubmitLogin = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    user: UserInterface
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
      setFormInvalid(true);
      setErrorMessage(ErrorField.form, "Server error");
    }
    setLoading(false);
  };

  const onSubmitSignup = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    user: UserInterface,
    password: string,
    confirmPass: string,
    setUser: Function,
    setPassword: Function,
    setConfirmPass: Function
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
        setTimeout(() => {
          setUser(defaultUser);
          setPassword("");
          setConfirmPass("");
          navigate("/");
        }, 5000);
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
      if (e instanceof Error && userAlreadyExists(e.message)) {
        setEmailInvalid(true);
        setErrorMessage(ErrorField.email, e.message);
      } else {
        setFormInvalid(true);
        setErrorMessage(ErrorField.form, "Server error");
      }
    }
    setLoading(false);
  };

  return { onSubmitLogin, onSubmitSignup };
};
