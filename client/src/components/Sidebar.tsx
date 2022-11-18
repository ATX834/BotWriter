import { useState } from "react";
import { ButtonGroup, Stack } from "@chakra-ui/react";
import { TiPen } from "react-icons/ti";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { GiSewingMachine } from "react-icons/gi";
import SidebarButton from "./SidebarButton";

export default function Sidebar() {
  const [show, setShow] = useState(true);
  return (
    <>
      <Stack
        onClick={() => {
          setShow(true);
        }}
        onMouseLeave={() => {
          setShow(false);
        }}
        bg="secondary.main"
      >
        <ButtonGroup>
          <Stack>
            <SidebarButton
              show={show}
              CustomIcon={MdOutlineSpaceDashboard}
              path="/dashboard"
              text="Dashboard"
            />
            <SidebarButton
              show={show}
              CustomIcon={TiPen}
              path="/sample-letter/new"
              text="Create sample letter"
            />
            <SidebarButton
              show={show}
              CustomIcon={GiSewingMachine}
              path="/generate"
              text="Generate letter"
            />
          </Stack>
        </ButtonGroup>
      </Stack>
    </>
  );
}
