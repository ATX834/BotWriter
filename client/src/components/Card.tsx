import { Box } from "@chakra-ui/react";

export default function Card({
  children,
  margin
}: {
  children: JSX.Element | JSX.Element[] | string;
  margin: string;
}) {
  return (
    <Box margin={margin} padding="4" borderRadius="10" bg="secondary.main" maxW="md">
      {children}
    </Box>
  );
}

Card.defaultProps = {
  margin: "4",
};