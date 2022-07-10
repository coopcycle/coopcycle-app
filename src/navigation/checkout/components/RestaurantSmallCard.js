import { Dimensions, TouchableOpacity, View } from 'react-native';
import { Box, ChevronRightIcon, HStack, Image, Text, VStack } from 'native-base';
import { getNextShippingTimeAsText } from '../../../utils/checkout';
import { greyColor } from '../../../styles/common';
import React from 'react';
import { withTranslation } from 'react-i18next';

const { width } = Dimensions.get('window')

const RestaurantSmallCard = (props) => {
  const { restaurant, onPress, shippingTime } = props
  const AltText = () => {
    let text;
    if (restaurant.facets.cuisine.length > 0) {
      text = restaurant.facets.cuisine.join(' ∙ ');
    } else {
      text = restaurant.address.streetAddress;
    }

    //FIXME: See if there is an other way to prevent long text to push element out of the screen
    return <Text noOfLines={1} maxWidth={width - 160} >{text}</Text>

  }
  return (
    <><TouchableOpacity onPress={() => onPress(restaurant) }>
      <HStack space={4} padding={2}>
        <Image size={shippingTime ? 'sm' : 'xs'} source={{ uri: restaurant.image }} alt={restaurant.name} />
        <VStack>
          <Text bold>{restaurant.name}</Text>
          <AltText/>
          {shippingTime && <Text>{getNextShippingTimeAsText(restaurant)}</Text>}
        </VStack>
        <View style={{ flexGrow: 1, justifyContent:'center', alignItems: 'flex-end' }}>
          <ChevronRightIcon />
        </View>
      </HStack>
    </TouchableOpacity>
      <Box marginLeft={5} marginRight={5} borderBottomWidth={1} borderColor={greyColor} />
    </>
  )
}

export default (withTranslation()(RestaurantSmallCard))
