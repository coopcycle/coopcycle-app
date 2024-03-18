import { Heading, Text, View, useColorModeValue } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { isMandatoryOption } from '../../../utils/product';

export const OptionsSectionHeader = ({ options }) => {
  const someOptionsAreMandatory = options.some(option =>
    isMandatoryOption(option),
  );

  const { t } = useTranslation();
  const backgroundColor = useColorModeValue('white', '#1a1a1a');

  return (
    <View style={[{ padding: 24 }, { backgroundColor }]}>
      <Heading size="md">{t('CHECKOUT_PRODUCT_OPTIONS_TITLE')}</Heading>
      {someOptionsAreMandatory && (
        <Text sub>{t('SOME_OPTION_IS_REQUIRED_SELECT_ONE_VALUE')}</Text>
      )}
    </View>
  );
};
