import _ from 'lodash'
import { useState } from 'react'
import {
  getPriceForOptionValue,
  isAdditionalOption,
  parseOptionValuesRange,
} from '../../../utils/product'

function getValuesRange(option) {
  if (option.valuesRange) {
    return parseOptionValuesRange(option.valuesRange)
  }

  return [ 0, Infinity ]
}

function isValidOption(option, values) {
  /**
   * TODO: This implementation is based on the similar code in the coopcycle-web repository
   * https://github.com/coopcycle/coopcycle-web/blob/8b42d087da427b7c1128859bdb81520ac8803324/js/app/cart/components/ProductOptionsModalContext.js#L23
   * Ideally, it should try to extract ProductOptionsModalContext into a shared library: https://github.com/coopcycle/coopcycle-frontend-js
   * and use it in both repositories.
   */

  const totalQuantity = values.reduce(
    (quantity, val) => quantity + val.quantity,
    0,
  )

  if (!option.additional) {
    return totalQuantity > 0
  }

  const [ min, max ] = getValuesRange(option)

  if (totalQuantity < min) {
    return false
  }

  if (totalQuantity > max) {
    return false
  }

  return true
}

function valuesForOption(selection, option) {
  const codes = option.hasMenuItem.map(item => item.identifier)
  return selection.filter(item => codes.includes(item.code))
}

export default function useProductOptionsBuilder(options) {
  const [ selected, setSelected ] = useState([])

  const invalidOptions = options.filter(
    option => !isValidOption(option, valuesForOption(selected, option)),
  )

  const isValid = invalidOptions.length === 0

  const findOptionByOptionValue = optionValue => {
    return _.find(options, o => {
      return (
        _.findIndex(
          o.hasMenuItem,
          el => el.identifier === optionValue.identifier,
        ) !== -1
      )
    })
  }

  const getQuantity = optionValue => {
    const index = _.findIndex(
      selected,
      item => item.code === optionValue.identifier,
    )

    if (index !== -1) {
      return selected[index].quantity
    }

    return 0
  }

  const getQuantityForOption = option => {
    const ids = option.hasMenuItem.map(el => el.identifier)
    const items = _.filter(selected, item => ids.includes(item.code))

    return _.sumBy(items, item => item.quantity)
  }

  const withoutValues = option => {
    const ids = option.hasMenuItem.map(el => el.identifier)
    return _.filter(selected, item => !ids.includes(item.code))
  }

  const contains = optionValue => {
    const index = _.findIndex(
      selected,
      el => el.code === optionValue.identifier,
    )

    return index !== -1
  }

  const add = optionValue => {
    increment(optionValue)
  }

  const increment = optionValue => {
    const option = findOptionByOptionValue(optionValue)

    if (isAdditionalOption(option)) {
      const range = getValuesRange(option)
      const max = range[1]
      const optionQuantity = getQuantityForOption(option)

      if (max !== Infinity && optionQuantity >= max) {
        return
      }

      const newSelected = [...selected]

      const index = _.findIndex(
        newSelected,
        el => el.code === optionValue.identifier,
      )

      if (index !== -1) {
        const quantity = newSelected[index].quantity

        newSelected.splice(index, 1, {
          code: optionValue.identifier,
          quantity: quantity + 1,
          price: getPriceForOptionValue(optionValue),
        })
      } else {
        newSelected.push({
          code: optionValue.identifier,
          quantity: 1,
          price: getPriceForOptionValue(optionValue),
        })
      }
      setSelected(newSelected)
    } else {
      const newSelected = withoutValues(option)

      newSelected.push({
        code: optionValue.identifier,
        quantity: 1,
        price: getPriceForOptionValue(optionValue),
      })

      setSelected(newSelected)
    }
  }

  const decrement = optionValue => {
    const index = _.findIndex(
      selected,
      el => el.code === optionValue.identifier,
    )

    if (index !== -1) {
      const newSelected = [...selected]
      const nextQuantity = newSelected[index].quantity - 1

      if (nextQuantity === 0) {
        newSelected.splice(index, 1)
      } else {
        newSelected.splice(index, 1, {
          code: optionValue.identifier,
          quantity: nextQuantity,
          price: getPriceForOptionValue(optionValue),
        })
      }

      setSelected(newSelected)
    }
  }

  return {
    selected,
    isValid,
    contains,
    getQuantity,
    add,
    increment,
    decrement,
  }
}
