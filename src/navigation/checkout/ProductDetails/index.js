import React, { useMemo, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Divider, SectionList } from 'native-base'
import _ from 'lodash'
import { formatPrice } from '../../../utils/formatting'
import { useTranslation } from 'react-i18next'
import FooterButton from '../components/FooterButton'
import useProductOptionsBuilder from './ProductOptionsBuilder'
import ItemSeparator from '../../../components/ItemSeparator'
import { ProductImage } from './ProductImage'
import { ProductInfo } from './ProductInfo'
import { ProductQuantity } from './ProductQuantity'
import { OptionHeader } from './OptionHeader'
import { OptionsSectionHeader } from './OptionsSectionHeader'
import { OptionValue } from './OptionValue'
import { isAdditionalOption } from '../../../utils/product'
import { useDispatch } from 'react-redux'
import { addItemV2 } from '../../../redux/Checkout/actions'

const LIST_SECTION_QUANTITY = 'quantity'
const LIST_SECTION_OPTIONS_HEADER = 'options-header'
const LIST_SECTION_OPTION = 'option'

export default props => {
  const product = props.route.params?.product
  const productOptions =
    product && Array.isArray(product.menuAddOn) ? product.menuAddOn : []

  const [ quantity, setQuantity ] = useState(1)
  const {
    selected: selectedOptions,
    isValid: optionsAreValid,
    contains,
    getQuantity,
    add,
    increment,
    decrement,
  } = useProductOptionsBuilder(productOptions)

  const list = useRef()

  const { t } = useTranslation()

  const dispatch = useDispatch()

  const shouldRenderOptions = productOptions.length > 0

  const menuSections = productOptions.map(menuSection => ({
    ...menuSection,
    type: LIST_SECTION_OPTION,
    data: menuSection.hasMenuItem,
  }))

  // render static elements as section items (not as section headers)
  // to avoid this issue: https://github.com/facebook/react-native/issues/38248
  const data = [{ type: LIST_SECTION_QUANTITY, data: ['static-item'] }]
    .concat(
      shouldRenderOptions
        ? [
            { type: LIST_SECTION_OPTIONS_HEADER, data: ['static-item'] },
            ...menuSections,
          ]
        : [],
    )
    .map((section, index) => ({
      ...section,
      index,
    }))

  const findSectionByOptionValue = optionValue => {
    return _.find(data, section => {
      if (section.hasMenuItem) {
        return (
          _.findIndex(
            section.hasMenuItem,
            el => el.identifier === optionValue.identifier,
          ) !== -1
        )
      } else {
        return false
      }
    })
  }

  const addOptionValue = optionValue => {
    add(optionValue)

    const option = findSectionByOptionValue(optionValue)

    if (option && !isAdditionalOption(option)) {
      // if it's a single choice option scroll to the next one
      const nextIndex = option.index + 1

      if (list.current && nextIndex < data.length) {
        list.current.scrollToLocation({
          sectionIndex: nextIndex,
          itemIndex: 1, // for some reason it scrolls to the top if itemIndex is 0, same issue: https://stackoverflow.com/questions/76311750/scrolltolocation-always-scrolling-to-top-in-sectionlist-in-react-native
        })
      }
    }
  }

  const totalPrice = useMemo(() => {
    if (shouldRenderOptions && !optionsAreValid) {
      return null
    }

    let total = product.offers.price

    if (selectedOptions.length) {
      const optionsTotal = selectedOptions.reduce((acc, option) => {
        return acc + option.price * option.quantity
      }, 0)
      total += optionsTotal
    }

    total *= quantity

    return total
  }, [
    optionsAreValid,
    product.offers.price,
    quantity,
    selectedOptions,
    shouldRenderOptions,
  ])

  const _onPressAddToCart = () => {
    const restaurant = props.route.params?.restaurant

    dispatch(addItemV2(product, quantity, restaurant, selectedOptions))
    props.navigation.navigate('CheckoutRestaurant', { restaurant })
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <SectionList
        style={{ flex: 1 }}
        ref={list}
        sections={data}
        keyExtractor={(item, index) => index}
        ItemSeparatorComponent={ItemSeparator}
        stickySectionHeadersEnabled={true}
        ListHeaderComponent={() => (
          <>
            <ProductImage product={product} />
            <ProductInfo product={product} />
          </>
        )}
        renderSectionHeader={({ section }) => {
          if (section.type === LIST_SECTION_OPTION) {
            return <OptionHeader option={section} />
          } else {
            return null
          }
        }}
        renderItem={({ item, section, index }) => {
          if (section.type === LIST_SECTION_QUANTITY) {
            return (
              <>
                <Divider my="2" />
                <ProductQuantity quantity={quantity} setQuantity={setQuantity} />
                <Divider my="2" />
              </>
            )
          } else if (section.type === LIST_SECTION_OPTIONS_HEADER) {
            return <OptionsSectionHeader options={productOptions} />
          } else if (section.type === LIST_SECTION_OPTION) {
            return (
              <OptionValue
                option={section}
                optionValue={item}
                index={index}
                contains={contains}
                getQuantity={getQuantity}
                add={addOptionValue}
                increment={increment}
                decrement={decrement}
              />
            )
          } else {
            return null
          }
        }}
      />
      {totalPrice !== null ? (
        <FooterButton
          testID="addProduct"
          text={`${t('ADD_TO_CART')} ${formatPrice(totalPrice)}`}
          onPress={() => _onPressAddToCart()}
        />
      ) : null}
    </SafeAreaView>
  )
}
