import {
  Box,
  ButtonGroup,
  Heading,
  HStack,
  Image,
  Spacer,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import OutlineButton from "./OutlineButton";
import SolidButton from "./SolidButton";
import Logo from "../assets/images/bot.png";

export default function Navbar() {
  const { isLogged } = useAuth();

  return (
    <HStack bg="secondary.main" py="2">
      <Box p="2">
        <Link to="/">
          <HStack>
            <Image boxSize="30px" objectFit="cover" src={Logo}></Image>
            <Heading size='lg'>BotWriter</Heading>
          </HStack>
        </Link>
      </Box>
      <Spacer />
      <ButtonGroup px="3">
        {isLogged ? (
          <>
            <Link to="/logout">
              <OutlineButton>Logout</OutlineButton>
            </Link>
          </>
        ) : (
          <>
            <Link to="/login">
              <OutlineButton>Login</OutlineButton>
            </Link>
            <Link to="/signup">
              <SolidButton>Register</SolidButton>
            </Link>
          </>
        )}
      </ButtonGroup>
    </HStack>
  );
}
