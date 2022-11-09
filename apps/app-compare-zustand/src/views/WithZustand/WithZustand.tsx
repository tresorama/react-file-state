import { ChakraProvider, extendTheme, ThemeOverride } from "@chakra-ui/react";
import { Editor } from "./components/Editor/Editor";
import { VariantsReel } from "./components/VariantsReel/VariantsReel";

// Chakra Ui Theme
const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false
  }
} as ThemeOverride);


// Main Component
export const WithZustand = () => {
  return (
    <ChakraProvider theme={theme}>
      <VariantsReel />
      <Editor />
    </ChakraProvider>
  );
};


