import { Text } from "@chakra-ui/react";
import createError from "http-errors";

function Error({ error }: { error: number }) {
  const err = createError(error);
  return (
    <>
      <Text>{error} error</Text>
      <Text>{err.message}</Text>
    </>
  );
}

export default Error;
