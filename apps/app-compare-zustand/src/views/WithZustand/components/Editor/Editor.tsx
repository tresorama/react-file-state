import React from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { editorStore } from "../../store/editor-store-zustand";
import { pick } from "../../store/utils";
import { Panel } from "./components/Panel/Panel";
import { VariantForm } from "./components/VariantForm/VariantForm";

export const Editor = () => {
  // state for the editor
  const editorState = editorStore.useStore(s => pick(s, ['current_variant_index', 'variants']));
  const editorActions = editorStore.useStore(s => pick(s, ['goNextVariant', 'goPrevVariant', 'deleteCurrentVariant', 'enableEditing', 'disableEditing', 'setDraftValues', 'saveDraftAsNewVariant', 'saveDraftOverwritingVariant']));
  const editorDerivedState = editorStore.useDerivedStore();

  return (
    <>
      <Panel>
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
              <Text mt={10} fontSize="md" fontWeight="bold">Variant currently published!</Text>
              <Text mt={10} fontSize="xs">
                Move with arrows between variants.
              </Text>
              <Text mt={5} fontSize="xs">
                {`"Little Hand" toggles the panel`}
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
                    Edit {editorState.current_variant_index + 1}
                  </Button>
                  {editorState.variants.length > 2 && (
                    <Button
                      colorScheme="red"
                      onClick={editorActions.deleteCurrentVariant}
                    >
                      Delete {editorState.current_variant_index + 1}
                    </Button>
                  )}
                  <Text
                    maxW="18ch"
                    my={2}
                    fontSize="xs"
                  >{`Press "Edit X" to edit this variation or create a new one from this one.`}</Text>
                  {/* <Button onClick={editorState.destroyStorage}>Distruggi Storage</Button> */}
                </>
              )}
              {editorDerivedState.isEditing && (
                <>
                  <Button onClick={editorActions.disableEditing}>
                    Cancel and Return to list
                  </Button>
                  <Button
                    colorScheme="blue"
                    onClick={editorActions.saveDraftAsNewVariant}
                  >
                    Save as New ({editorState.variants.length + 1})
                  </Button>
                  <Button onClick={editorActions.saveDraftOverwritingVariant}>
                    Overwrite Existing ({editorState.current_variant_index + 1})
                  </Button>
                  <Text
                    maxW="23ch"
                    mt={4}
                    fontSize="xs"
                  >{`Change the parameters, then press "Save as New (X)" to make a new variant.`}</Text>
                  <Text
                    maxW="23ch"
                    mt={2}
                    fontSize="xs"
                  >{`Press "Overwrite X" if you want to edit the current one directly instead.`}</Text>
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
        {/* <pre>{JSON.stringify(editorState, null, 2)}</pre> */}
      </Panel>
    </>
  );
};