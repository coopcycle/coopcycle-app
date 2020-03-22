import numbro from 'numbro'
import getSymbolFromCurrency from 'currency-symbol-map'

let CURRENCY_SYMBOL = '€'
let CURRENCY_CODE = 'eur'

export function setCurrencyCode(currencyCode) {
  CURRENCY_CODE = currencyCode
  CURRENCY_SYMBOL = getSymbolFromCurrency(currencyCode.toUpperCase()) || ''
}

export function formatPrice(price) {

  return numbro(price / 100).formatCurrency({ mantissa: 2, currencySymbol: CURRENCY_SYMBOL })
}

export function formatPriceWithCode(price) {

  return numbro(price / 100).formatCurrency({ mantissa: 2, currencySymbol: CURRENCY_CODE.toUpperCase() })
}
