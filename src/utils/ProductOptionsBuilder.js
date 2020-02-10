import _ from 'lodash'

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

  parseRange(range) {

    const matches = range.match(/^(\[|\()([0-9]+),([0-9]?)(\]|\))$/)

    return [
      parseInt(matches[2], 10),
      matches[3] === '' ? Infinity : parseInt(matches[3], 10),
    ]
  }

  withoutValues(option) {
    const ids = option.hasMenuItem.map(item => item.identifier)
    this.payload = _.filter(this.payload, item => !ids.includes(item.code))
  }

  isValid() {

    for (let i = 0; i < this.options.length; i++) {
      let option = this.options[i]
      if (!option.additional && !this.containsValueForOption(option)) {
        return false
      }
    }

    return true
  }

  add(optionValue) {
    this.increment(optionValue)
  }

  increment(optionValue) {

    const option = this.getOption(optionValue)

    if (option.additional) {

      const range = option.valuesRange ? this.parseRange(option.valuesRange) : [ 0, Infinity ]
      const [ min, max ] = range
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
          quantity: quantity + 1
        })

      } else {

        this.payload.push({
          code: optionValue.identifier,
          quantity: 1
        })

      }

    } else {

      this.withoutValues(option)

      this.payload.push({
        code: optionValue.identifier,
        quantity: 1
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
          quantity: nextQuantity
        })
      }
    }
  }

  contains(optionValue) {
    const index = _.findIndex(this.payload, item => item.code === optionValue.identifier)

    return index !== -1
  }

  containsValueForOption(option) {

    const ids = option.hasMenuItem.map(item => item.identifier)
    const payloadIds = this.payload.map(item => item.code)

    return _.intersection(ids, payloadIds).length > 0
  }

  getFirstInvalidOption() {

    for (let i = 0; i < this.options.length; i++) {
      let option = this.options[i]
      if (!option.additional && !this.containsValueForOption(option)) {
        return option
      }
    }
  }

  getPayload() {
    return this.payload
  }
}

export default ProductOptionsBuilder
