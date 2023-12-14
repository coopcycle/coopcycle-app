import { StyleSheet } from 'react-native'
import { Badge, HStack, Icon, Text, useColorModeValue } from 'native-base'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { getNextShippingTimeAsText } from '../../../utils/checkout'
import React from 'react'

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    position: 'absolute',
    height: 30,
    alignSelf: 'center',
    bottom: -15,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 12,
  },
})

export const CategoryBadge = ({ label }) => {
  // styled via theme
  return (
    <Badge variant="subtle" mr="1">
      {label}
    </Badge>
  )
}

export const TimingBadge = ({ restaurant }) => {
  const bg = useColorModeValue('gray.200', 'gray.800')

  return (
    <HStack style={[styles.badge]} bg={bg} px="2">
      <Icon as={FontAwesome} name="clock-o" size="xs" mr="1" />
      <Text style={styles.badgeText}>
        {getNextShippingTimeAsText(restaurant)}
      </Text>
    </HStack>
  )
}
