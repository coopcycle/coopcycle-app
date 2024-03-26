import { Heading, Text, View, useColorModeValue } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import {
  isMandatoryOption,
  parseOptionValuesRange,
} from '../../../utils/product';

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingVertical: 6,
  },
  title: {
    fontSize: 16,
    flexDirection: 'row',
    marginTop: 8,
    lineHeight: 24,
  },
  mandatory: {
    fontWeight: 'normal',
    fontSize: 10,
  },
  range: {
    fontSize: 12,
  },
});

export const OptionHeader = ({ option }) => {
  const backgroundColor = useColorModeValue('white', '#1a1a1a');
  const { t } = useTranslation();

  return (
    <View style={[styles.header, { backgroundColor }]}>
      <Heading style={styles.title}>
        {option.name}{' '}
        {isMandatoryOption(option) && (
          <Text style={styles.mandatory} ml={1}>
            ({t('OPTION_REQUIRED')})
          </Text>
        )}
      </Heading>
      {option.valuesRange ? (
        <ValuesRange valuesRange={option.valuesRange} />
      ) : null}
    </View>
  );
};

const ValuesRange = ({ valuesRange }) => {
  const { t } = useTranslation();
  const [min, max] = parseOptionValuesRange(valuesRange);

  return (
    <Text style={styles.range}>
      {t('CHECKOUT_PRODUCT_OPTIONS_CHOICES_BETWEEN', { min, max })}
    </Text>
  );
};
