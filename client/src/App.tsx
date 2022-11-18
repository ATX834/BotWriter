import React from "react"
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./theme/theme";
import { AuthProvider } from "./hooks/useAuth";
import Router from "./Router";

function App() {
  return (
    <AuthProvider>
      <ChakraProvider theme={theme}>
        <Router />
      </ChakraProvider>
    </AuthProvider>
  );
}

export default App;
