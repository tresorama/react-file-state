import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { editorStore, pick } from "../../store/editor-store-zustand";
import { VariantForm } from "../VariantForm/VariantForm";

export const Editor = () => {
  // state for the editor
  const editorState = editorStore.useStore(s => pick(s, ['current_variant_index', 'variants']));
  const editorActions = editorStore.useStore(s => pick(s, ['goNextVariant', 'goPrevVariant', 'deleteCurrentVariant', 'enableEditing', 'disableEditing', 'setDraftValues', 'saveDraftAsNewVariant', 'saveDraftOverwritingVariant']));
  const editorDerivedState = editorStore.useDerivedStore();

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
          overflow="auto"
          //maxW="220px"
          minH="20rem"
          maxH="100vh"
        // maxW="50%"
        >
          {/* NAV + CONTROLS */}
          <Flex p={2} wrap="wrap" direction="column" gap={2}>
            {!editorDerivedState.isEditing && (
              <Flex justifyContent="end" alignItems="center" gap={1}>
                <Button onClick={() => editorActions.goPrevVariant()}>{`⬅️`}</Button>
                <Text as="span">
                  {editorState.current_variant_index + 1} /{" "}
                  {editorState.variants.length}
                </Text>
                <Button onClick={editorActions.goNextVariant}>{`➡️`}</Button>
              </Flex>
            )}
            {editorDerivedState.show_production_variant && (
              <Box maxW="10ch">
                <Text>Cosi è il sito attualmente!</Text>
                <Text mt={10} fontSize="xs">
                  Muoviti con le frecce e crea le tue varianti per lo sfondo.
                </Text>
                <Text mt={5} fontSize="xs">
                  La manina apre e chiude il pannello..
                </Text>
              </Box>
            )}

            {!editorDerivedState.show_production_variant && (
              <>
                {!editorDerivedState.isEditing && (
                  <>
                    <Button
                      colorScheme="blue"
                      onClick={editorActions.enableEditing}
                    >
                      Modifica {editorState.current_variant_index + 1}
                    </Button>
                    {editorState.variants.length > 2 && (
                      <Button
                        colorScheme="red"
                        onClick={editorActions.deleteCurrentVariant}
                      >
                        Elimina {editorState.current_variant_index + 1}
                      </Button>
                    )}
                    <Text
                      maxW="18ch"
                      my={2}
                      fontSize="xs"
                    >{`Premi "Modifica X" per modificare questa variante o crearne una nuova partendo da questa.`}</Text>
                    {/* <Button onClick={editorState.destroyStorage}>Distruggi Storage</Button> */}
                  </>
                )}
                {editorDerivedState.isEditing && (
                  <>
                    <Button onClick={editorActions.disableEditing}>
                      Annulla e Torna alla lista
                    </Button>
                    <Button
                      colorScheme="blue"
                      onClick={editorActions.saveDraftAsNewVariant}
                    >
                      Salva come nuovo ({editorState.variants.length + 1})
                    </Button>
                    <Button onClick={editorActions.saveDraftOverwritingVariant}>
                      Sovrascrivi attuale (
                      {editorState.current_variant_index + 1})
                    </Button>
                    <Text
                      maxW="23ch"
                      mt={4}
                      fontSize="xs"
                    >{`Cambia i parametri, poi premi "Salva come nuovo (X)" per fare una nuova variante.`}</Text>
                    <Text
                      maxW="23ch"
                      mt={2}
                      fontSize="xs"
                    >{`Premi "Sovrascrivi X" se invecevuoi modificare direttamente quella corrente.`}</Text>
                  </>
                )}
              </>
            )}
          </Flex>

          {/* FORM */}
          {editorDerivedState.isEditing && (
            <Box py={2} px={4}>
              <VariantForm />
            </Box>
          )}
          <pre>{JSON.stringify(editorState, null, 2)}</pre>
        </Box>
      </Box>
    </>
  );
};