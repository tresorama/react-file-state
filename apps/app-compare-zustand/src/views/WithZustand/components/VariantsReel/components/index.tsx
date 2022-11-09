import { Box, Flex } from "@chakra-ui/react";
import type { Variant } from '../../../store/editor-store-zustand';

type ViewVariantCardProps = {
  title: React.ReactNode;
  variant: Variant;
};

export const ViewVariantCard = ({ title, variant }: ViewVariantCardProps) => (
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

export const ViewVariantCardNull = ({ title }: Pick<ViewVariantCardProps, 'title'>) => (
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
