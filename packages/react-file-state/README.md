# What is this ?

React-File-State.

Version: 0.0.1  
Status: Early stage of Development  
**NOT PRODUCTION READY**  

## Usage

1. Create a Store (you can create as many store eas you want)
```tsx
import { createStore, mutate } from '@tresorama/react-file-state';

// Entity - types
type Variant = {
  colorA_hue: number;
  colorA_start: number;
  colorB_hue: number;
  gradient_angle: number;
};
type EditorState = {
  current_variant_index: number;
  variants: Variant[];
  draftVariant: null | Variant;
};
// Entity - initial state
const initialState: EditorState = {
  current_variant_index: 0,
  variants: [
    {
      // dummy slot
      colorA_hue: 0,
      colorA_start: 0,
      colorB_hue: 0,
      gradient_angle: 0
    },
    {
      colorA_hue: 0,
      colorA_start: 52,
      colorB_hue: 300,
      gradient_angle: 314
    },
    {
      colorA_hue: 60,
      colorA_start: 52,
      colorB_hue: 220,
      gradient_angle: 314
    },
    {
      colorA_hue: 40,
      colorA_start: 52,
      colorB_hue: 300,
      gradient_angle: 314
    },
    {
      colorA_hue: 286,
      colorA_start: 47,
      colorB_hue: 200,
      gradient_angle: 59
    }
  ],
  draftVariant: null
};

// State Store => combine state + derived state + actions
export const editorStore = createStore(
  initialState,
  (state) => ({
    show_production_variant: state.current_variant_index === 0,
    variant: state.variants[state.current_variant_index],
    isEditing: state.draftVariant !== null,
    serialized_state: JSON.stringify(state)
  }),
  (get, set, set2) => ({
    goNextVariant: () => set2(prev => {
      const newIndex = Math.min(
        prev.current_variant_index + 1,
        prev.variants.length - 1
      );
      return { ...prev, current_variant_index: newIndex };
    }),
    goPrevVariant: () => set2(prev => {
      const newIndex = Math.max(prev.current_variant_index - 1, 0);
      const newState = { ...prev, current_variant_index: newIndex };
      return newState;
    }),
    deleteCurrentVariant: () => set2(prev => {
      const newState = mutate(prev, (prev) => {
        if (prev.variants.length <= 2) return; // abort
        prev.variants.splice(prev.current_variant_index, 1);
        prev.current_variant_index = Math.min(
          prev.current_variant_index,
          prev.variants.length - 1
        );
      });
      return newState;
    }),
    enableEditing: () => set2(prev => {
      return {
        ...prev,
        draftVariant: { ...prev.variants[prev.current_variant_index] }
      };
    }),
    disableEditing: () => set2(prev => {
      return { ...prev, draftVariant: null };
    }),
    setDraftValues: (key: keyof Variant, value: Variant[typeof key]) => set2(prev => {
      if (prev.draftVariant === null) return prev;
      const draftVariant = { ...prev.draftVariant, [key]: value };
      return { ...prev, draftVariant };
    }),
    saveDraftAsNewVariant: () => set2(prev => {
      return mutate(prev, (prev) => {
        if (prev.draftVariant === null) return;
        prev.variants.push(prev.draftVariant);
        prev.current_variant_index = prev.variants.length - 1;
      });
    }),
    saveDraftOverwritingVariant: () => set2(prev => {
      return mutate(prev, (prev) => {
        if (prev.draftVariant === null) return;
        prev.variants.splice(prev.current_variant_index, 1, prev.draftVariant);
      });
    })
    //destroyStorage: () => editorStateStorage.destroy(),
  })
);

```

2. Use the store 
```tsx
import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { editorStore } from '../../store/editor-store';
import hash from 'hash-sum';


export const VariantsReel = () => {
  const [{ variants }] = editorStore.useStore((({ variants }) => ({ variants })));
  return (
    <Flex wrap="wrap" gap="10" p="10">
      <VariantDraftCard />
      {variants.map((variant, i) => (
        <VariantCard
          key={hash(i + JSON.stringify(variant))}
          index={i}
        />
      ))}
    </Flex>
  );
};

const VariantDraftCard = () => {
  const [draftVariant] = editorStore.useStore(s => s.draftVariant);
  return draftVariant ? (
    <ViewVariantCard title="Draft" variant={draftVariant} />
  ) : (
    <ViewVariantCardNull title="Draft" />
  );
};
const VariantCard = ({ index }: { index: number; }) => {
  const [variant] = editorStore.useStore((s => s.variants[index]));
  if (!variant) return <>Nyllllll</>;
  return <ViewVariantCard title={`Variant ${index + 1}`} variant={variant} />;
};

type Variant = ReturnType<typeof editorStore.get>['variants'][number];

const ViewVariantCard = ({ title, variant }: { title: React.ReactNode; variant: Variant; }) => (
  <Box
    flexBasis="200px"
    border="2px"
    borderColor="whiteAlpha.500"
    borderRadius="base"
  >
    <Box px="2" py="2" bg="whiteAlpha.200" fontSize="lg" fontWeight="medium">
      {title}
    </Box>
    {[
      ["A", variant.colorA_hue],
      ["A Start", variant.colorA_start],
      ["B", variant.colorB_hue],
      ["Angle", variant.gradient_angle],
    ].map(([label, value]) => (
      <Flex key={label} borderBottom="2px" borderColor="whiteAlpha.200">
        <Box flex="5" px="2" py="1" >{label}</Box>
        <Box flex="7" px="2" py="1">{value}</Box>
      </Flex>
    ))}
  </Box>
);

const ViewVariantCardNull = ({ title }: { title: React.ReactNode; }) => (
  <Box
    flexBasis="200px"
    border="2px"
    borderColor="whiteAlpha.500"
    borderRadius="base"
  >
    <Box px="2" py="2" bg="whiteAlpha.200" fontSize="lg" fontWeight="medium">{title}</Box>
    <Flex borderBottom="2px" borderColor="whiteAlpha.200">
      <Box px="2" py="1" >Null</Box>
    </Flex>
  </Box>
);
```
