import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  colors: {
    primary: {
      main: "#c3372e",
    },
    secondary: {
      main: "#22242e",
    },
    text: {
      main: "#f2e0c2",
    },
    hover: "#8B0000",
  },
  styles: {
    global: {
      h1: {
        fontSize: "2em",
        fontWeight: "bold",
      },
      h2: {
        fontSize: "2xl",
        fontWeight: "bold",
      },
      h3: {
        fontSize: "lg",
      },
      h4: {
        fontSize: "md",
      },
      h5: {
        fontSize: "sm",
        fontWeight: "bold"
      },
      h6: {
        fontSize: "xs",
        fontWeight: "bold"
      },
    },
  },
});
