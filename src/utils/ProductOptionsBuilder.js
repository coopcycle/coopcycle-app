import _ from 'lodash'

function _parseRange(range) {
  const matches = range.match(/^(\[|\()([0-9]{1,}),([0-9]*)(\]|\))$/)

  return [
    parseInt(matches[2], 10),
    matches[3] === '' ? Infinity : parseInt(matches[3], 10),
  ]
}

function getValuesRange(option) {
  if (option.valuesRange) {
    return _parseRange(option.valuesRange)
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
    0
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

class ProductOptionsBuilder {

  constructor(options = []) {
    this.options = options
    this.payload = []
  }

  getOption(optionValue) {
    return _.find(this.options, o => {
      return _.findIndex(o.hasMenuItem, item => item.identifier === optionValue.identifier) !== -1
    })
  }

  isAdditional(optionValue) {
    const option = this.getOption(optionValue)
    return (option && option.additional) || false
  }

  allowsRange(optionValue) {
    const option = this.getOption(optionValue)
    return (option && option.valuesRange) || false
  }

  getQuantity(optionValue) {
    const index = _.findIndex(this.payload, item => item.code === optionValue.identifier)

    if (index !== -1) {
      return this.payload[index].quantity
    }

    return 0
  }

  getQuantityForOption(option) {
    const ids = option.hasMenuItem.map(item => item.identifier)
    const items = _.filter(this.payload, item => ids.includes(item.code))

    return _.sumBy(items, item => item.quantity)
  }

  withoutValues(option) {
    const ids = option.hasMenuItem.map(item => item.identifier)
    this.payload = _.filter(this.payload, item => !ids.includes(item.code))
  }

  parseRange(range) {
    return _parseRange(range)
  }

  getInvalidOptions() {
    return this.options.filter(option => !isValidOption(option, this.valuesForOption(option)))
  }

  isValid() {
    return this.getInvalidOptions().length === 0
  }

  getFirstInvalidOption() {
    return this.getInvalidOptions().shift()
  }

  contains(optionValue) {
    const index = _.findIndex(this.payload, item => item.code === optionValue.identifier)

    return index !== -1
  }

  valuesForOption(option) {
    const codes = option.hasMenuItem.map(item => item.identifier)
    return this.payload.filter(item => codes.includes(item.code))
  }

  add(optionValue) {
    this.increment(optionValue)
  }

  increment(optionValue) {

    const option = this.getOption(optionValue)

    if (option.additional) {

      const range = getValuesRange(option)
      const max = range[1]
      const optionQuantity = this.getQuantityForOption(option)

      if (max !== Infinity && optionQuantity >= max) {
        return
      }

      this.payload = this.payload.slice()

      const index = _.findIndex(this.payload, item => item.code === optionValue.identifier)

      if (index !== -1) {

        const quantity = this.payload[index].quantity

        this.payload.splice(index, 1, {
          code: optionValue.identifier,
          quantity: quantity + 1,
          price: optionValue.hasOwnProperty('offers') ? optionValue.offers.price : 0,
        })

      } else {

        this.payload.push({
          code: optionValue.identifier,
          quantity: 1,
          price: optionValue.hasOwnProperty('offers') ? optionValue.offers.price : 0,
        })

      }

    } else {

      this.withoutValues(option)

      this.payload.push({
        code: optionValue.identifier,
        quantity: 1,
        price: optionValue.hasOwnProperty('offers') ? optionValue.offers.price : 0,
      })
    }
  }

  decrement(optionValue) {
    const index = _.findIndex(this.payload, item => item.code === optionValue.identifier)

    if (index !== -1) {

      this.payload = this.payload.slice()
      const nextQuantity = this.payload[index].quantity - 1

      if (nextQuantity === 0) {
        this.payload.splice(index, 1)
      } else {
        this.payload.splice(index, 1, {
          code: optionValue.identifier,
          quantity: nextQuantity,
          price: optionValue.hasOwnProperty('offers') ? optionValue.offers.price : 0,
        })
      }
    }
  }

  getPayload() {
    return this.payload
  }
}

export default ProductOptionsBuilder
