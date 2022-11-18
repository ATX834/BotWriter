import React from "react";
import { Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";

export default function PasswordInput({
  password,
  setPassword,
  setConfirmPass,
  passInvalid,
}: {
  password: string;
  passInvalid: boolean;
  setPassword: Function | null;
  setConfirmPass: Function | null;
}) {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  return (
    <InputGroup size="md">
      <Input
        isInvalid={passInvalid}
        pr="4.5rem"
        type={show ? "text" : "password"}
        placeholder={
          setPassword ? "Enter password" : "Confirm password"
        }
        value={password}
        onChange={(e) => {
          if (setPassword) setPassword(e.target.value);
          if (setConfirmPass) setConfirmPass(e.target.value);
        }}
      />
      <InputRightElement width="4.5rem">
        <Button
          h="1.75rem"
          bg="primary.main"
          _hover={{ background: "hover" }}
          size="sm"
          onClick={handleClick}
        >
          {show ? "Hide" : "Show"}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}

PasswordInput.defaultProps = {
  setPassword: null,
  setConfirmPass: null,
};
