import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, GridItem, Input } from "@chakra-ui/react";
import OptionInterface from "../interface/OptionInterface";
import OptionField from "./OptionField";

function AutocompleteField({
  options,
  setOptions,
  dropdown,
  setDropdown,
  loading,
  setLoading,
  refetch,
  setSelected,
  setActualStep,
}: {
  options: OptionInterface[];
  dropdown: boolean;
  setDropdown: Function;
  setLoading: Function;
  refetch: any;
  setOptions: Function;
  loading: boolean;
  setSelected: Function;
  setActualStep: Function;
}) {
  return (
    <>
      <GridItem
        colSpan={11}
        // h="10"
        bg="secondary.main"
        borderTopLeftRadius="4px"
        borderBottomLeftRadius={!dropdown ? "4px" : ""}
      >
        <Input
          px="3"
          variant="flushed"
          contentEditable="true"
          placeholder="Search here"
          borderBottom="none !important"
          boxShadow="none !important"
          onChange={async (e) => {
            setDropdown(false);
            setLoading(true);
            const { data }: any = await refetch({
              search: e.target.value,
            });

            if (data) {
              setOptions(data.getSampleLettersBySearchTerm);
            }
          }}
        />
      </GridItem>
      <GridItem
        colStart={12}
        colEnd={12}
        h="10"
        bg="secondary.main"
        borderTopRightRadius="4px"
        borderBottomRightRadius={!dropdown ? "4px" : ""}
      >
        <Button
          width="100%"
          isLoading={loading}
          bg="transparent"
          onClick={() => setDropdown(!dropdown)}
        >
          <ChevronDownIcon />
        </Button>
      </GridItem>
      {dropdown &&
        options.slice(0, 10).map((option, index) => {
          const rowPosition = index + 2;
          return (
            <OptionField
              rowPosition={rowPosition}
              setDropdown={setDropdown}
              option={option}
              setSelected={setSelected}
              setActualStep={setActualStep}
            />
          );
        })}
    </>
  );
}

export default AutocompleteField;
