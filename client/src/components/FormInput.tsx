import { FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import React from "react";

interface FormInputInterface {
  field: string;
  placeholder: string;
  value: string | undefined;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  isInvalid: boolean | undefined;
  error: string;
  type: string;
}

function FormInput({
  field,
  placeholder,
  value,
  onChange,
  error,
  isInvalid,
  type,
}: FormInputInterface) {
  const ucFirst = (str: string) => str[0].toUpperCase() + str.slice(1);
  const isItInvalid = () => {
    return typeof isInvalid === "undefined" ? value === "" : isInvalid;
  };
  return (
    <>
      <FormLabel pt="1" htmlFor={field}>
        {ucFirst(field)}
      </FormLabel>
      <Input
        isInvalid={isItInvalid()}
        id={field}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {isItInvalid() && <FormErrorMessage>{error}</FormErrorMessage>}
    </>
  );
}
FormInput.defaultProps = {
  isInvalid: undefined,
  type: "text",
};

export default FormInput;
