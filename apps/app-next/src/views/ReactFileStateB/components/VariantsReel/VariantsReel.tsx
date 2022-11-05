import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { editorStore } from '../../store/editor-store-b';
import hash from 'hash-sum';


export const VariantsReel = () => {
  const [{ variants }] = editorStore.useStore((({ variants }) => ({ variants })));
  return (
    <Flex wrap="wrap" gap="10" p="10">
      <VariantDraftCard />
      {variants.map((variant, i) => (
        // <ViewVariantCard
        //   key={hash(i + JSON.stringify(variant))}
        //   title={`Variant ${i + 1}`}
        //   variant={variant}
        // />
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
