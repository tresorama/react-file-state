import { ChakraProvider } from "@chakra-ui/react";
import { Editor } from "./components/Editor/Editor";
import { VariantsReel } from "./components/VariantsReel/VariantsReel";

// Main Component
export const ReactFileState = () => {
  return (
    <ChakraProvider>
      <VariantsReel />
      <Editor />
    </ChakraProvider>
  );
};


