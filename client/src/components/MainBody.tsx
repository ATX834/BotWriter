import { Container, Flex } from "@chakra-ui/react";
import { useAuth } from "../hooks/useAuth";
import useWindowDimensions from "../hooks/useWindowsDimensions";
import Sidebar from "./Sidebar";

function MainBody({ children }: { children: JSX.Element | JSX.Element[] }) {
  const { height, width } = useWindowDimensions();
  const { isLogged } = useAuth();

  return (
    <Flex
      h={height + "px"}
      w="100%"
      maxW={width + "px"}
      bg="primary.main"
      color="text.main"
    >
      {isLogged && <Sidebar />}
      <Container maxW="container.xl" centerContent py="10" >
        {children}
      </Container>
    </Flex>
  );
}

export default MainBody;
