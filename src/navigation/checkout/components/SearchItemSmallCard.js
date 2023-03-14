import { ChevronRightIcon, Flex, HStack, Image, Text, VStack } from 'native-base';
import React from 'react';
import { useTranslation, withTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';

const SearchItemSmallCard = ({ item, onPress }) => {
  const { t } = useTranslation();

  return (
    <>
      <TouchableOpacity onPress={() => onPress(item)}>
        <HStack space={4} padding={2} ml={2}>
          { item.image_url ?
            <Image size={'xs'} source={{ uri: item.image_url }} alt={item.name} /> : null
          }
          <VStack justifyContent="center">
            <Text>{item.name}</Text>
            { item.result_type === 'product' ?
              <Text fontSize="12" color="muted.500">{ t('SEARCH_PRODUCT_ITEM_SUBTITLE', { shop: item.shop_name }) }</Text> : null
            }
          </VStack>
          <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
            <ChevronRightIcon />
          </View>
        </HStack>
      </TouchableOpacity>
    </>
  )
}

export default connect()(withTranslation()(SearchItemSmallCard))
