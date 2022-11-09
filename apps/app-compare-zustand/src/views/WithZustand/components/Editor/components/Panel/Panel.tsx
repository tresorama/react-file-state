import { Box, Button } from "@chakra-ui/react";
import { useToggle } from "./hooks/use-toggle";

type PanelWrapperProps = {
  children: React.ReactNode;
};

export const Panel = (props: PanelWrapperProps) => {
  const [panelIsExpanded, togglePanel] = useToggle(false);

  return (
    <>
      {/* FIXED WRAPPER LAYER */}
      <Box
        zIndex="100"
        position="fixed"
        inset="0"
        display="grid"
        justifyContent="end"
        alignContent="center"
        pointerEvents="none"
        sx={{ "& > *": { pointerEvents: "all" } }}
      >
        {/* PANEL */}
        <Box
          bg="blackAlpha.800"
          color="gray.200"
          border="2px"
          borderColor="blackAlpha.900"
          borderRadius="base"
          position="relative"
          overflow="visible"
          minH="20rem"
          maxH="100vh"
          transform={panelIsExpanded ? 'none' : "translateX(100%)"}
          transition="100ms transform"
        >

          {/* PANEL TOGGLER */}
          <Button
            onClick={togglePanel}
            position="absolute"
            top="50%"
            right="100%"
            variant="unstyled"
            size="lg"
            h="auto"
            border="0"
          >
            <Box as="span" fontSize="2em">
              {!panelIsExpanded ? "👈" : "👉"}
            </Box>
          </Button>

          {/* PANEL CONTENT */}
          {props.children}

        </Box>
      </Box>
    </>
  );
};
