import { Box, Button, Circle, HStack, Icon, Text } from "@chakra-ui/react";
import { useState } from "react";
import { IconType } from "react-icons/lib";
import { Link, useNavigate } from "react-router-dom";

function SidebarButton({
  CustomIcon,
  show,
  path,
  text,
}: {
  CustomIcon: IconType;
  show: boolean;
  path: string;
  text: string;
}) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  return (
    <HStack marginTop="1">
      <Box
        width="100%"
        mx="2"
        my="0.5"
        borderRadius="0.375rem"
        bg={hovered ? "primary.main" : ""}
        onMouseEnter={() => {
          setHovered(true);
        }}
        onMouseLeave={() => {
          setHovered(false);
        }}
        onClick={() => navigate(path)}
      >
        <Button boxShadow="none !important" variant="link" outline="none">
          <Circle size="40px" bg="primary.main" color="text.main">
            <Icon as={CustomIcon} />
          </Circle>
          {show ? (
            <Text mx="2" color={hovered ? "text.main" : "primary.main"}>
              {text}
            </Text>
          ) : (
            ""
          )}
        </Button>
      </Box>
    </HStack>
  );
}

export default SidebarButton;
