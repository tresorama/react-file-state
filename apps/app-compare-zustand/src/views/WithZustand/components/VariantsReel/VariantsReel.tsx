import React from 'react';
import { Flex } from '@chakra-ui/react';
import { editorStore } from '../../store/editor-store-zustand';
import { pick } from '../../store/utils';
import hash from 'hash-sum';
import { ViewVariantCard, ViewVariantCardNull } from './components';


export const VariantsReel = () => {
  const { variants } = editorStore.useStore((s => pick(s, ['variants'])));
  return (
    <Flex wrap="wrap" gap="10" p="10">

      {/* VARIANT DRAFT  */}
      <VariantDraftCard />

      {/* VARIANTS LIST */}
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
  const { draftVariant } = editorStore.useStore((s => pick(s, ['draftVariant'])));
  return draftVariant ? (
    <ViewVariantCard title="Draft" variant={draftVariant} />
  ) : (
    <ViewVariantCardNull title="Draft" />
  );
};
const VariantCard = ({ index }: { index: number; }) => {
  const variant = editorStore.useStore((s => s.variants[index]));
  return <ViewVariantCard title={`Variant ${index + 1}`} variant={variant} />;
};
