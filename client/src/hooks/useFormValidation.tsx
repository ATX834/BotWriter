import { useState } from "react";
import { defaultErr } from "../data/default";
import { ErrorField } from "../enum/ErrorField";

export default function useFormValidation() {
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [passInvalid, setPassInvalid] = useState(false);

  const isFormInvalid = (): boolean => {
    return emailInvalid && passInvalid;
  };

  const setFormInvalid = (bool: boolean) => {
    setEmailInvalid(bool);
    setPassInvalid(bool);
  };

  const resetError = () => {
    setErrors(defaultErr);
  };

  const [errors, setErrors] = useState(defaultErr);

  const setErrorMessage = (field: ErrorField, message: string) => {
    switch (field) {
      case ErrorField.form:
        setErrors({
          ...errors,
          form: message,
        });
        break;
      case ErrorField.email:
        setErrors({
          ...errors,
          email: message,
        });
        break;
      case ErrorField.password:
        setErrors({
          ...errors,
          password: message,
        });
    }
  };
  return {
    errors,
    setErrorMessage,
    resetError,
    isFormInvalid,
    emailInvalid,
    passInvalid,
    setFormInvalid,
    setEmailInvalid,
    setPassInvalid,
  };
}
