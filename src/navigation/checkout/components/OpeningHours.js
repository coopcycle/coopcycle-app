import React from 'react'

import { withTranslation } from 'react-i18next'
import { HStack, Text, View } from 'native-base'
import OpeningHoursSpecification from '../../../utils/OpeningHoursSpecification'
import { useColorScheme } from 'react-native';

const OpeningHours = (props) => {

  const colorScheme = useColorScheme()
  const { openingHoursSpecification } = props.restaurant

  const background = colorScheme === 'dark' ? 'dark.300' : 'white'
  const highlight = colorScheme === 'dark' ? 'dark.50' : 'blueGray.300'

  const ohs = new OpeningHoursSpecification()
  ohs.openingHours = openingHoursSpecification

  const weekdays = ohs.state.reduce((acc, day, index) => {
    const hours = day.ranges.reduce((acc2, range) => {
      acc2.push(<Text textAlign={'center'} paddingX={3} >{range.join(' - ')}</Text>)
      return acc2
    }, [])
    acc.push(<HStack paddingY={1} backgroundColor={day.today ? highlight : background}>
      <Text textAlign={'center'} minW={'3em'} bold={day.today}>
        {day.label}
      </Text>
      {hours}
    </HStack>)
    return acc
  }, [])

  return <View>{weekdays}</View>

}

export default (withTranslation())(OpeningHours)
