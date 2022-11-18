import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Input,
  Button,
  ModalHeader,
  FormErrorMessage,
} from "@chakra-ui/react";
import { KeyboardEvent, MutableRefObject, useRef, useState } from "react";

function ModalInput({
  isOpen,
  setValue,
  onClose,
}: {
  isOpen: boolean;
  setValue: Function;
  onClose: () => void;
}) {
  const inputRef = useRef() as MutableRefObject<HTMLInputElement>;
  const [error, setError] = useState("")
  const handleKeypress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (inputRef.current) {
      if(inputRef.current.value) {
        setValue(inputRef.current.value);
        setError("")
        onClose();
      }
      else {
        setError("Fill the input field")
      }
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
        <ModalContent>
          <ModalHeader />
          <ModalBody>
            <Input ref={inputRef} onKeyPress={handleKeypress} />
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
          </ModalBody>

          <ModalFooter></ModalFooter>
          <Button onClick={handleSubmit}>Submit</Button>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ModalInput;
