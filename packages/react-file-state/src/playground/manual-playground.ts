import { createStore } from "../create-store";

type Ordine = {
  nome: string,
  id_ordine: number;
};
const initialState: {
  ordini: Ordine[],
  editableOrdineId: null | Ordine['id_ordine'];
} = {
  ordini: [],
  editableOrdineId: null,
};
// View State - Shared State (same purpose of React Context)
const viewStore = createStore(
  initialState,
  (state) => ({
    isEditingOrdine: state.editableOrdineId !== null
  }),
  (set) => ({
    setEditableOrdine: (id_ordine: Ordine['id_ordine']) => set(prev => ({ ...prev, editableOrdineId: id_ordine })),
    closeEditableOrdine: () => set(prev => ({ ...prev, editableOrdineId: null }))
  })
);

const s = viewStore.get();
const w = viewStore.getDerived();
const sw = viewStore.getWithDerived();