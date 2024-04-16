import getSymbolFromCurrency from 'currency-symbol-map';
import numbro from 'numbro';

let CURRENCY_SYMBOL = '€';
let CURRENCY_CODE = 'eur';

export function setCurrencyCode(currencyCode) {
  CURRENCY_CODE = currencyCode;
  CURRENCY_SYMBOL = getSymbolFromCurrency(currencyCode.toUpperCase()) || '';
}

export function formatPrice(price, options = {}) {
  return numbro(price / 100).formatCurrency({
    mantissa: 2,
    currencySymbol: CURRENCY_SYMBOL,
    ...options,
  });
}

export function formatPriceWithCode(price, options = {}) {
  return numbro(price / 100).formatCurrency({
    mantissa: 2,
    currencySymbol: CURRENCY_CODE.toUpperCase(),
    ...options,
  });
}
