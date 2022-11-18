import { useQuery } from "@apollo/client";
import { GridItem, Button } from "@chakra-ui/react";
import { useState } from "react";
import { Step } from "../enum/Step";
import { GET_SAMPLE_LETTER_BY_USER } from "../graphql/queries/SampleLetter";
import OptionInterface from "../interface/OptionInterface";

function OptionField({
  rowPosition,
  setDropdown,
  option,
  setSelected,
  setActualStep,
}: {
  rowPosition: number;
  setDropdown: Function;
  option: OptionInterface;
  setSelected: Function;
  setActualStep: Function;
}) {
  const [hovered, setHovered] = useState(false);
  const { refetch } = useQuery(GET_SAMPLE_LETTER_BY_USER);

  return (
    <GridItem
      rowStart={rowPosition}
      rowEnd={rowPosition}
      colSpan={12}
      bg={hovered ? "text.main" : "blackAlpha.700"}
      color={hovered ? "primary.main" : "text.main"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Button
        width="100%"
        onClick={async (e) => {
          setDropdown(false);

          const { data } = await refetch({ id: option.id });

          if (data) {
            setSelected(data.getSampleLetterByUser);
            setActualStep(Step.SECOND);
          }
        }}
        bg="transparent"
      >
        {option.title}
      </Button>
    </GridItem>
  );
}

export default OptionField;
