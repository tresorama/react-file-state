import create from 'zustand';

export const pick = <T, U extends keyof T>(object: T, keys: U[]): Pick<T, U> => {
  return keys.reduce(
    (out, key) => ({ ...out, [key]: object[key] }),
    {} as Pick<T, U>
  );
};

const mutate = <A,>(a: A, massager: (a: A) => void): A => {
  // clone
  const clone: A = JSON.parse(JSON.stringify(a));
  // let consumer massage it
  // (inside massager you must mutate directly)
  massager(clone);
  // update persistent storage
  //editorStateStorage.save(clone);
  // return
  return clone;
};

// Entity - types
export type Variant = {
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
type EditorActions = {
  goNextVariant: () => void;
  goPrevVariant: () => void;
  deleteCurrentVariant: () => void;
  enableEditing: () => void;
  disableEditing: () => void;
  setDraftValues: (key: keyof Variant, value: Variant[typeof key]) => void;
  saveDraftAsNewVariant: () => void;
  saveDraftOverwritingVariant: () => void;
};
type EditorStore = EditorState & EditorActions;

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
const useStore = create<EditorStore>((set) => ({
  ...initialState,
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
  setDraftValues: (key, value) => set(prev => {
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
  })
  //destroyStorage: () => editorStateStorage.destroy(),
}));
const useDerivedStore = () => {
  return useStore(state => ({
    show_production_variant: state.current_variant_index === 0,
    variant: state.variants[state.current_variant_index],
    isEditing: state.draftVariant !== null,
    serialized_state: JSON.stringify(state)
  }));
};
export const editorStore = {
  useStore,
  useDerivedStore
};
