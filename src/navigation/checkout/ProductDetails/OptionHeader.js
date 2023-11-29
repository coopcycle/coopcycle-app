import React from 'react'
import { useColorScheme } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Box, Flex, Heading, Text } from 'native-base'
import {
  isMandatoryOption,
  parseOptionValuesRange,
} from '../../../utils/product'

export const OptionHeader = ({ option }) => {
  const colorScheme = useColorScheme()
  const { t } = useTranslation()

  return (
    <Box p="3" bg={colorScheme === 'dark' ? 'black' : 'white'}>
      <Flex direction="row" alignItems="center">
        <Heading size="sm">{option.name}</Heading>
        {isMandatoryOption(option) && (
          <Text sub ml={1}>
            ({t('OPTION_REQUIRED')})
          </Text>
        )}
      </Flex>
      {option.valuesRange ? (
        <ValuesRange valuesRange={option.valuesRange} />
      ) : null}
    </Box>
  )
}

const ValuesRange = ({ valuesRange }) => {
  const { t } = useTranslation()
  const [ min, max ] = parseOptionValuesRange(valuesRange)

  return (
    <Text sub>
      {t('CHECKOUT_PRODUCT_OPTIONS_CHOICES_BETWEEN', { min, max })}
    </Text>
  )
}
