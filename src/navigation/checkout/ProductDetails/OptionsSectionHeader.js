import { Heading, Text, View } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { isMandatoryOption } from '../../../utils/product';

export const OptionsSectionHeader = ({ options }) => {
  const someOptionsAreMandatory = options.some(option =>
    isMandatoryOption(option),
  );

  const { t } = useTranslation();

  return (
    <View>
      <Heading size="md">{t('CHECKOUT_PRODUCT_OPTIONS_TITLE')}</Heading>
      {someOptionsAreMandatory && (
        <Text sub>{t('SOME_OPTION_IS_REQUIRED_SELECT_ONE_VALUE')}</Text>
      )}
    </View>
  );
};
