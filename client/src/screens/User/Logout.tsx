import { useToast } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Logout() {
  const toast = useToast()
  const { signout } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    signout();
    toast({
      title: "You have been succefully logged out.",
      position: "top",
      status: "success",
      duration: 3000,
      isClosable: true,
    })
    navigate("/home");
  }, []);

  return <></>;
}
