import { Flex, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Stack, Text } from "@chakra-ui/react";
import type { SliderProps } from '@chakra-ui/react';

type MySliderProps = {
  label: string;
  value: number;
  onChange: (newValue: number) => void;
} & SliderProps;

export const MySlider = ({
  label,
  value,
  onChange,
  ...sliderProps
}: MySliderProps) => (
  <Stack>
    <Flex justifyContent="space-between" gap={3}>
      <Text fontSize="xs">{label}</Text>
      <Text as="span" fontSize="xs">
        {" "}
        {value}
      </Text>
    </Flex>
    <Slider defaultValue={value} onChange={onChange} {...sliderProps}>
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb />
    </Slider>
  </Stack>
);