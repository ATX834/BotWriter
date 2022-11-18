import { useMutation } from "@apollo/client";
import { useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CONFIRM_USER } from "../../graphql/mutations/User";
import Home from "../Home";

export default function Confirm() {
  const { token } = useParams();
  const [doConfirmUser] = useMutation(CONFIRM_USER);
  const toast = useToast();

  const confirmUser = async () => {
    const { data } = await doConfirmUser({
      variables: { token },
    });
    data.confirmUser
      ? toast({
          title: "New account confirmed.",
          position: "top",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
      : toast({
          title: "User doesn't exist",
          position: "top",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
  };

  useEffect(() => {
    if (token) {
      confirmUser();
    }
  }, [token]);

  return <Home />;
}
