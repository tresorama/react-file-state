import { Box } from "@chakra-ui/react";
import { editorStore } from "../../../../store/editor-store-zustand";
import { pick } from "../../../../store/utils";
import { MySlider } from "./components";

export const VariantForm = () => {
  const draftVariant = editorStore.useStore(s => s.draftVariant);
  const { setDraftValues } = editorStore.useStore(s => pick(s, ['setDraftValues']));
  if (!draftVariant) return <>Non dovresti vedermi mai</>;

  return (
    <Box>
      {/* COLOR A HUE */}
      <MySlider
        label="COLORE A"
        value={draftVariant.colorA_hue}
        onChange={(newValue) => {
          setDraftValues("colorA_hue", newValue);
        }}
        min={0}
        max={360}
        step={1}
      />
      {/* COLOR B HUE */}
      <MySlider
        label="COLORE B"
        value={draftVariant.colorB_hue}
        onChange={(newValue) => {
          setDraftValues("colorB_hue", newValue);
        }}
        min={0}
        max={360}
        step={1}
      />
      {/* COLOR A START */}
      <MySlider
        label="MIX"
        value={draftVariant.colorA_start}
        onChange={(newValue) => {
          setDraftValues("colorA_start", newValue);
        }}
        min={-100}
        max={100}
        step={1}
      />
      {/* GRADIENT ANGLE */}
      <MySlider
        label="ROTAZIONE"
        value={draftVariant.gradient_angle}
        onChange={(newValue) => {
          setDraftValues("gradient_angle", newValue);
        }}
        min={0}
        max={360}
        step={1}
      />
    </Box>
  );
};
