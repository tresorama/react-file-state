import { createStore, mutate } from '@tresorama/react-file-state';
import { isBrowser } from '../utils/is-dom';
import { SimpleStorage } from '../utils/simple-storage';

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

// Persistent Storage
const editorStateStorage = new SimpleStorage<EditorState>('editor-state-DEV-feat/migrate-to-useSyncExternalStore');

// State Store => combine state + derived state + actions
export const editorStore = createStore(
  Object.assign(
    initialState,
    { isHydrated: false }
  ),
  (state) => ({
    show_production_variant: state.current_variant_index === 0,
    variant: state.variants[state.current_variant_index],
    isEditing: state.draftVariant !== null,
    serialized_state: JSON.stringify(state)
  }),
  (set, get) => ({
    goNextVariant: () => set(prev => {
      const newIndex = Math.min(
        prev.current_variant_index + 1,
        prev.variants.length - 1
      );
      return { ...prev, current_variant_index: newIndex };
    }),
    goPrevVariant: () => set(prev => {
      const newIndex = Math.max(prev.current_variant_index - 1, 0);
      const newState = { ...prev, current_variant_index: newIndex };
      return newState;
    }),
    deleteCurrentVariant: () => set(prev => {
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
    enableEditing: () => set(prev => {
      return {
        ...prev,
        draftVariant: { ...prev.variants[prev.current_variant_index] }
      };
    }),
    disableEditing: () => set(prev => {
      return { ...prev, draftVariant: null };
    }),
    setDraftValues: (key: keyof Variant, value: Variant[typeof key]) => set(prev => {
      if (prev.draftVariant === null) return prev;
      const draftVariant = { ...prev.draftVariant, [key]: value };
      return { ...prev, draftVariant };
    }),
    saveDraftAsNewVariant: () => set(prev => {
      return mutate(prev, (prev) => {
        if (prev.draftVariant === null) return;
        prev.variants.push(prev.draftVariant);
        prev.current_variant_index = prev.variants.length - 1;
      });
    }),
    saveDraftOverwritingVariant: () => set(prev => {
      return mutate(prev, (prev) => {
        if (prev.draftVariant === null) return;
        prev.variants.splice(prev.current_variant_index, 1, prev.draftVariant);
      });
    }),
    destroyStorage: () => editorStateStorage.destroy(),
  })
);



if (isBrowser) {
  // save to cache on every updates
  editorStore.subscribe(() => {
    editorStateStorage.save(editorStore.get());
  });

  // load from cache if existing
  setTimeout(() => {
    const cached = editorStateStorage.get();
    if (cached) editorStore.set({ ...cached, isHydrated: true });
    else editorStore.set(prev => ({ ...prev, isHydrated: true }));
  }, 5000);
}
