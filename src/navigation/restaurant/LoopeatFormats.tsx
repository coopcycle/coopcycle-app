import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import { Input, InputField } from '@/components/ui/input';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';

import {
  loadLoopeatFormats,
  updateLoopeatFormats,
} from '../../redux/Restaurant/actions';

function LoopeatFormats({
  route,
  order,
  loopeatFormats,
  loadLoopeatFormats,
  updateLoopeatFormats,
}) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const fetchLoopeatFormats = useCallback(() => {
    loadLoopeatFormats(order);
  }, [loadLoopeatFormats, order]);

  useEffect(() => {
    fetchLoopeatFormats();
  }, [fetchLoopeatFormats]);

  if (loopeatFormats.length === 0) {
    return;
  }

  const initialValues = { loopeatFormats: loopeatFormats };

  return (
    <SafeAreaView flex={1} edges={['bottom']}>
      <Box flex={1}>
        <Text className="p-3">{t('RESTAURANT_LOOPEAT_DISCLAIMER')}</Text>
        <Formik
          initialValues={initialValues}
          onSubmit={values => {
            updateLoopeatFormats(order, values.loopeatFormats, updatedOrder =>
              navigation.navigate('RestaurantOrder', { order: updatedOrder }),
            );
          }}>
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <>
              <FlatList
                data={values.loopeatFormats}
                keyExtractor={(item, index) => `loopeat_format_item_#${index}`}
                renderItem={({ item, index }) => (
                  <VStack className="mb-3 px-3">
                    <Heading size="sm">{item.orderItem.name}</Heading>
                    {item.formats.map((format, formatIndex) => (
                      <HStack
                        className="mb-2 items-center justify-between"
                        key={`loopeat_format_#${formatIndex}`}
                        >
                        <Text>{format.format_name}</Text>
                        <Input className="w-1/4">
                          <InputField
                            keyboardType="number-pad"
                            returnKeyType="done"
                            maxLength={2}
                            value={`${values.loopeatFormats[index]?.formats[formatIndex]?.quantity}`}
                            onChangeText={handleChange(
                              `loopeatFormats.${index}.formats.${formatIndex}.quantity`,
                            )}
                          />
                        </Input>
                      </HStack>
                    ))}
                  </VStack>
                )}
              />
              <Box className="px-3">
                <Button onPress={handleSubmit}>
                  <ButtonText>{t('VALIDATE')}</ButtonText>
                </Button>
              </Box>
            </>
          )}
        </Formik>
      </Box>
    </SafeAreaView>
  );
}

function mapStateToProps(state, ownProps) {
  const order = ownProps.route.params?.order;

  return {
    order,
    loopeatFormats: Object.prototype.hasOwnProperty.call(
      state.restaurant.loopeatFormats,
      order['@id'],
    )
      ? state.restaurant.loopeatFormats[order['@id']]
      : [],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadLoopeatFormats: order => dispatch(loadLoopeatFormats(order)),
    updateLoopeatFormats: (order, loopeatFormats, cb) =>
      dispatch(updateLoopeatFormats(order, loopeatFormats, cb)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoopeatFormats);
