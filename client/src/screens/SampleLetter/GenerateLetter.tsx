import { useMutation, useQuery } from "@apollo/client";

import {
  Box,
  Button,
  Center,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Input,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import OptionInterface from "../../interface/OptionInterface";
import AutocompleteField from "../../components/AutocompleteField";
import { Step } from "../../enum/Step";
import { IoMdArrowBack } from "react-icons/io";
import { decodeHTMLSpecialChar } from "../../utils/htmlSpecialCharacter";
import { GET_SAMPLE_LETTER_BY_SEARCH_TERM } from "../../graphql/queries/SampleLetter";
import {
  PREVIEW_HTML,
  GENERATE_PDF,
} from "../../graphql/mutations/SampleLetter";

const apiUrl = process.env.NODE_ENV === "production" ? "https://api.bot-writer.com" : "http://localhost:4000";

function GenerateLetter() {
  const [dropdown, setDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions]: [OptionInterface[], Function] = useState([]);
  const [actualStep, setActualStep] = useState(Step.FIRST);
  const [html, setHtml] = useState("");

  const [selected, setSelected]: [OptionInterface, Function] = useState({
    id: undefined,
    title: undefined,
  });
  const [formData, setFormData]: [
    { value: string; input?: string }[],
    Function
  ] = useState([]);

  const { refetch } = useQuery(GET_SAMPLE_LETTER_BY_SEARCH_TERM);
  const [doPreviewHtml] = useMutation(PREVIEW_HTML);
  const [doGeneratePdf] = useMutation(GENERATE_PDF);

  useEffect(() => {
    setLoading(false);
    setDropdown(true);
  }, [options]);

  useEffect(() => {
    if (actualStep === Step.SECOND && selected.hooks) {
      let newHooks: { value: string; input?: string }[] = [];

      for (const hook of selected.hooks) {
        newHooks = [...newHooks, { value: hook.value }];
      }
      setFormData(newHooks);
    }
  }, [actualStep]);

  useEffect(() => {}, [html]);

  return (
    <>
      <Grid
        width="100%"
        px="40"
        templateColumns="repeat(12, 1fr)"
        templateRows={`repeat(${
          actualStep !== Step.FIRST
            ? 1
            : options.length > 10
            ? 10
            : options.length
        }, 1fr)`}
      >
        {actualStep !== Step.FIRST && (
          <GridItem borderRadius="6px" colSpan={1} marginBottom="5">
            <IconButton
              aria-label=""
              as={IoMdArrowBack}
              my="1"
              onClick={() => setActualStep(actualStep - 1)}
            />
          </GridItem>
        )}
        {actualStep === Step.FIRST && (
          <AutocompleteField
            dropdown={dropdown}
            setDropdown={setDropdown}
            loading={loading}
            setLoading={setLoading}
            options={options}
            setOptions={setOptions}
            refetch={refetch}
            setSelected={setSelected}
            setActualStep={setActualStep}
          />
        )}
        {actualStep === Step.SECOND && (
          <GridItem
            rowStart={2}
            rowEnd={2}
            borderRadius="6px"
            bg="secondary.main"
            colSpan={12}
          >
            <Center>
              <Heading my="5" size="lg">
                Enter variables
              </Heading>
            </Center>
            {selected.hooks &&
              selected.hooks.map((hook) => {
                return (
                  <Box m="5">
                    <FormLabel>
                      <Heading my="2" size="md">
                        {hook.value[0].toUpperCase() + hook.value.substring(1)}
                      </Heading>
                    </FormLabel>
                    <Input
                      placeholder={hook.value}
                      onChange={(e) => {
                        setFormData(
                          formData.map((data) => {
                            if (data.value === hook.value) {
                              return { ...data, input: e.target.value };
                            }
                            return data;
                          })
                        );
                      }}
                    />
                  </Box>
                );
              })}
            <Center>
              <Button
                bg="primary.main"
                float="right"
                margin="5"
                onClick={async () => {
                  setActualStep(Step.THIRD);
                  const { data } = await doPreviewHtml({
                    variables: {
                      markers: formData,
                      sampleLetterId: selected.id,
                    },
                  });
                  setHtml(data.previewHtml);
                }}
              >
                Generate
              </Button>
            </Center>
          </GridItem>
        )}
        {actualStep === Step.THIRD && (
          <>
            <GridItem colSpan={12}>
              {html && (
                <Box
                  borderRadius="4px"
                  p="10"
                  bg="text.main"
                  color="secondary.main"
                >
                  <div dangerouslySetInnerHTML={{ __html: html }} />
                </Box>
              )}

              <Button
                marginRight="2"
                marginTop="2"
                onClick={() => {
                  navigator.clipboard.writeText(
                    decodeHTMLSpecialChar(html.replace(/<\/?[^>]+>/gi, " "))
                  );
                }}
              >
                Copy
              </Button>
              <Button
                marginRight="2"
                marginTop="2"
                onClick={async () => {
                  const { data } = await doGeneratePdf({
                    variables: {
                      markers: formData,
                      generatePdfId: selected.id,
                    },
                  });
                  const filename = data.generatePdf;

                  window.location.replace(`${apiUrl}/files/${filename}`);
                }}
              >
                Download
              </Button>
            </GridItem>
          </>
        )}
      </Grid>
    </>
  );
}

export default GenerateLetter;
