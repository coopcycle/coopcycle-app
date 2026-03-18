import _ from 'lodash';
import React, { useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { addItemV2 } from '../../../redux/Checkout/actions';
import { formatPrice } from '../../../utils/formatting';
import FooterButton from '../components/FooterButton';
import { OptionHeader } from './OptionHeader';
import { Option } from './Option';
import { OptionsSectionHeader } from './OptionsSectionHeader';
import { ProductImage } from './ProductImage';
import { ProductInfo } from './ProductInfo';
import useProductOptionsBuilder from './ProductOptionsBuilder';
import { ProductQuantity } from './ProductQuantity';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from "@shopify/flash-list";
import { Box } from '@/components/ui/box';

function ListHeaderComponent({ product }) {

  return (
    <>
      <ProductImage product={product} />
      <View>
        <ProductInfo product={product} />
      </View>
    </>
  );
}

export default props => {
  const product = props.route.params?.product;
  const productOptions =
    product && Array.isArray(product.menuAddOn) ? product.menuAddOn : [];

  const [quantity, setQuantity] = useState(1);
  const {
    selected: selectedOptions,
    isValid: optionsAreValid,
    contains,
    getQuantity,
    add,
    increment,
    decrement,
  } = useProductOptionsBuilder(productOptions);

  const list = useRef(null);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // https://shopify.github.io/flash-list/docs/guides/section-list/
  const data = productOptions.reduce((result, productOption) => {
    // Section header
    result.push({ type: 'sectionHeader', data: productOption });
    // Option group
    result.push({ type: 'optionValues', data: productOption });
    return result;
  }, []);

  const shouldRenderOptions = productOptions.length > 0;

  const findSectionHeaderIndexByOptionValue = optionValue => {
    const sectionHeaders = _.filter(data, (item) => item.type === 'sectionHeader');
    return _.findIndex(sectionHeaders, (sh) => {
      return _.findIndex(sh.data.hasMenuItem, optVal => optVal.identifier === optionValue.identifier) !== -1;
    });
  };

  const addOptionValue = optionValue => {

    add(optionValue);

    const sectionHeaderIndex = findSectionHeaderIndexByOptionValue(optionValue);
    const nextIndex = sectionHeaderIndex + 2;

    if (list.current && nextIndex < data.length) {
      list.current.scrollToIndex({
        index: nextIndex,
        animate: true,
      });
    }
  };

  const totalPrice = useMemo(() => {
    if (shouldRenderOptions && !optionsAreValid) {
      return null;
    }

    let total = product.offers.price;

    if (selectedOptions.length) {
      const optionsTotal = selectedOptions.reduce((acc, option) => {
        return acc + option.price * option.quantity;
      }, 0);
      total += optionsTotal;
    }

    total *= quantity;

    return total;
  }, [
    optionsAreValid,
    product.offers.price,
    quantity,
    selectedOptions,
    shouldRenderOptions,
  ]);

  const _onPressAddToCart = () => {
    const restaurant = props.route.params?.restaurant;

    dispatch(addItemV2(product, quantity, restaurant, selectedOptions));
    props.navigation.popTo('CheckoutMain', { restaurant });
  };

  const stickyHeaderIndices = data
    .reduce((result, item, index) => {
      if (item.type === 'sectionHeader') {
        result.push(index)
      }
      return result;
    }, [])

  return (
    <SafeAreaView
      testID="productDetails"
      style={{ flex: 1 }}
      edges={['bottom']}>
      <Box className="bg-background-100 p-4 gap-2">
        <ListHeaderComponent product={product} />
        <ProductQuantity
          quantity={quantity}
          setQuantity={setQuantity}
        />
        <OptionsSectionHeader options={productOptions} />
      </Box>
      <FlashList
        ref={list}
        data={data}
        stickyHeaderIndices={stickyHeaderIndices}
        renderItem={({ item, index }) => {

          if (item.type === 'sectionHeader') {
            return <OptionHeader option={item.data} />
          }

          return (
            <Box className="p-4">
              <Option
                option={item.data}
                index={index}
                getQuantity={getQuantity}
                add={addOptionValue}
                increment={increment}
                decrement={decrement}
                />
            </Box>
          )
        }}
        getItemType={(item) => item.type}
      />
      {totalPrice !== null ? (
        <FooterButton
          testID="addProduct"
          text={`${t('ADD_TO_CART')} ${formatPrice(totalPrice)}`}
          onPress={() => _onPressAddToCart()}
        />
      ) : null}
    </SafeAreaView>
  );
};
