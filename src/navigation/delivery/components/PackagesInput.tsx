import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { Text } from '@/components/ui/text';
import { usePackagesCount } from '@/src/navigation/delivery/hooks/usePackagesCount';
import { StorePackage } from '@/src/redux/api/types';
import Range from '@/src/navigation/checkout/ProductDetails/Range';
import { useBackgroundContainerColor } from '@/src/styles/theme';
import {
  BasePackagesFields,
  PackageWithQuantity,
} from '@/src/navigation/delivery/utils';

type Props = {
  packages?: StorePackage[];
  initialPackagesCount?: PackageWithQuantity[];
};

export const PackagesInput = ({ packages, initialPackagesCount }: Props) => {
  const { t } = useTranslation();
  const backgroundColor = useBackgroundContainerColor();

  const { packagesCount, incrementQuantity, decrementQuantity } =
    usePackagesCount(packages, initialPackagesCount);

  const { errors } = useFormikContext<BasePackagesFields>();

  return (
    <View>
      <View
        style={{
          gap: 16,
          marginTop: 4,
        }}>
        {packages?.length ? (
          packagesCount.map((item, index) => {
            return (
              <View
                style={[
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    gap: 16,
                    backgroundColor,
                  },
                ]}
                key={`${item.type}-${index}`}>
                <Range
                  onPressIncrement={() => incrementQuantity(item.type)}
                  onPressDecrement={() => decrementQuantity(item.type)}
                  quantity={item.quantity}
                  testID={`package-${index}`}
                />
                <TouchableOpacity
                  style={{
                    flex: 1,
                  }}
                  onPress={() => incrementQuantity(item.type)}>
                  <Text>{item.type}</Text>
                </TouchableOpacity>
              </View>
            );
          })
        ) : (
          <Text>{t('STORE_NEW_DELIVERY_NO_PACKAGES')}</Text>
        )}
      </View>
      {errors.packages && (
        <Text note style={styles.errorText}>
          {errors.packages}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    paddingVertical: 5,
    color: '#FF4136',
  },
});
