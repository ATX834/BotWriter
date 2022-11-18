import { Button } from "@chakra-ui/react";
import React from "react";

export default function SolidButton(props: {
  children: JSX.Element | JSX.Element[] | string;
}) {
  return (
    <Button
      _hover={{
        background: "hover",
      }}
      bg="primary.main"
    >
      {props.children}
    </Button>
  );
}
