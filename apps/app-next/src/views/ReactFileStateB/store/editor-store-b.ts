import { createStore, mutate } from 'react-file-state-b';

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
