import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import {
  Button,
  Grid,
  GridItem,
  Heading,
  useDisclosure,
} from "@chakra-ui/react";
import { html2json } from "html2json";
import ModalInput from "./ModalInput";
import { useMutation } from "@apollo/client";
import { CREATE_SAMPLE_LETTER } from "../graphql/mutations/SampleLetter";

const MAX_LENGTH: number = 10;

export default function TextEditor() {
  const [value, setValue] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [doCreateSampleLetter] = useMutation(CREATE_SAMPLE_LETTER);

  const editorRef = useRef(null) as MutableRefObject<any>;
  const titleRef = useRef() as MutableRefObject<HTMLHeadingElement>;

  useEffect(() => {
    if (value) {
      let newInput = `<input style="width: ${MAX_LENGTH}ch;background-color:black; color: white" maxlength="${MAX_LENGTH}" value=${value} />`;
      editorRef.current.setContent(
        editorRef.current.getContent().replace(/\/@/s, newInput)
      );
      setValue("");
    }
  }, [value]);

  const handleSubmitSampleLetter = async () => {
    if (editorRef.current && titleRef.current) {
      const newSampleTextContent = JSON.stringify(
        html2json(editorRef.current.getContent())
      );

      try {
        await doCreateSampleLetter({
          variables: {
            title: titleRef.current.innerText,
            content: newSampleTextContent,
          },
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleEditorChange = (actual: any) => {
    if (editorRef.current) {
      if (actual.includes("/@")) {
        onOpen();
      }
    }
  };
  return (
    <Grid
      templateColumns="repeat(12, 1fr)"
      templateRows={`repeat(4 }, 1fr)`}
      px="10"
    >
      <GridItem colSpan={12} rowStart={1} rowEnd={1}>
        <Heading>Create a new sample letter</Heading>
      </GridItem>
      <GridItem colSpan={12} rowStart={2} rowEnd={2}>
        <Heading ref={titleRef} my="5" size="lg" contentEditable={true}>
          <i>Your sample letter title</i>
        </Heading>
      </GridItem>
      <GridItem colSpan={12} rowStart={3} rowEnd={3}>
        <Editor
          apiKey="srmix3kf92bli4dxfo9eeyfr4f7xnsjujbbkfea4mo252czw"
          onInit={(evt, editor) => (editorRef.current = editor)}
          initialValue="<p></p>"
          init={{
            placeholder: "Write here...",
            height: 500,
            menubar: false,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "code",
              "help",
              "wordcount",
            ],
            toolbar:
              "undo redo | blocks | " +
              "bold italic forecolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "removeformat | help",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          }}
          onEditorChange={handleEditorChange}
        />
      </GridItem>
      <GridItem colStart={12} colEnd={12} rowStart={4} rowEnd={4}>
        <Button
          bg="primary.main"
          color="text.main"
          my="5"
          float="right"
          onClick={handleSubmitSampleLetter}
        >
          Submit sample letter
        </Button>
      </GridItem>

      {isOpen && (
        <ModalInput isOpen={isOpen} setValue={setValue} onClose={onClose} />
      )}
    </Grid>
  );
}
