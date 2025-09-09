import { Icon, ChevronRightIcon } from '@/components/ui/icon';
import { HStack } from '@/components/ui/hstack';
import { Image } from '@/components/ui/image';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import React from 'react';
import { useTranslation, withTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';

const SearchItemSmallCard = ({ item, onPress }) => {
  const { t } = useTranslation();

  return (
    <>
      <TouchableOpacity onPress={() => onPress(item)}>
        <HStack space="sm" className="p-2 ml-2">
          {item.image_url ? (
            <Image
              size="xs"
              source={{ uri: item.image_url }}
              alt={item.name}
            />
          ) : null}
          <VStack className="justify-center">
            <Text>{item.name}</Text>
            {item.result_type === 'product' ? (
              <Text>
                {t('SEARCH_PRODUCT_ITEM_SUBTITLE', { shop: item.shop_name })}
              </Text>
            ) : null}
          </VStack>
          <View
            style={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}>
            <Icon as={ChevronRightIcon} size="lg" />
          </View>
        </HStack>
      </TouchableOpacity>
    </>
  );
};

export default connect()(withTranslation()(SearchItemSmallCard));
