import { Button } from "@chakra-ui/react";
import React from "react";

export default function OutlineButton(props: {
  children: JSX.Element | JSX.Element[] | string;
}) {
  return (
    <Button
      colorScheme="red"
      _hover={{ background: "hover", color: "text.main" }}
      variant="outline"
    >
      {props.children}
    </Button>
  );
}
