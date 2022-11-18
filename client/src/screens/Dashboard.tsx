import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Heading, useToast } from "@chakra-ui/react";
import "../theme/styles.css";

export default function Dashboard() {
  const [token, setToken]: [string, Function] = useState("");
  const { user, isLogged } = useAuth();
  const toast = useToast();

  useEffect(() => {

    if (document.readyState === "complete") {
      setToken(localStorage.getItem("token"));
      toast({
        title: `Welcome back ${user.firstname} ${user.lastname} !`,
        position: "top",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }
  }, [isLogged]);

  return (
    <>
      <Heading>Dashboard</Heading>
    </>
  );
}
