import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  isMandatoryOption,
  parseOptionValuesRange,
} from '../../../utils/product';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';

export const OptionHeader = ({ option }) => {
  const { t } = useTranslation();

  return (
    <Box className="bg-background-200 px-4 py-2">
      <HStack className="items-center" space="sm">
        <Heading>
          {option.name}
        </Heading>
        {isMandatoryOption(option) && (
        <Text size="xs">
          {t('OPTION_REQUIRED')}
        </Text>
        )}
        {option.valuesRange ? (
          <ValuesRange valuesRange={option.valuesRange} />
        ) : null}
      </HStack>

    </Box>
  );
};

const ValuesRange = ({ valuesRange }) => {
  const { t } = useTranslation();
  const [min, max] = parseOptionValuesRange(valuesRange);

  return (
    <Text size="xs">
      {t('CHECKOUT_PRODUCT_OPTIONS_CHOICES_BETWEEN', { min, max })}
    </Text>
  );
};
