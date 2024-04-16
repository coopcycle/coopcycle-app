import diacritics from 'diacritics';
import EscPosEncoder from 'esc-pos-encoder';
import _ from 'lodash';
import moment from 'moment';

import i18n from '../i18n';

import { formatPriceWithCode } from './formatting';

const CODEPAGE = 'auto';

// Hotfix x VS × encoding
const fixMultiplySymbol = text => text.replace('×', 'x');

export function encodeForPrinter(order, sunmi = false) {
  const maxChars = 32;

  let pickupLineDate = '';

  if (moment(order.pickupExpectedAt).isSame(moment(), 'day')) {
    pickupLineDate = i18n.t('RECEIPT_HEADING_PICKUP_EXPECTED_TODAY');
  } else {
    pickupLineDate = i18n.t('RECEIPT_HEADING_PICKUP_EXPECTED_ON', {
      time: moment(order.pickupExpectedAt).format('LL'),
    });
  }
  const pickupLineTime = i18n.t('RECEIPT_HEADING_PICKUP_EXPECTED_AT', {
    time: moment(order.pickupExpectedAt).format('LT'),
  });

  const hr = ''.padEnd(maxChars, '-');

  let options = {};

  if (sunmi) {
    options = {
      ...options,
      // Avoid "[Error: CP437 encoding is not support]" error
      // This is because the rule() & table() methods use a hardcoded codepage
      codepageMapping: {
        cp437: 0x00,
      },
    };
  }

  let encoder = new EscPosEncoder(options);

  encoder.initialize().codepage(CODEPAGE);

  if (sunmi) {
    // https://file.cdn.sunmi.com/SUNMIDOCS/SunmiPrinter-Developer-Docs-1-1.pdf
    //
    // The device settings can be adjusted in accordance to the needs of different countries or other requirements
    // to enable the printers to identify the data stream of the content to be printed.
    //
    // To print CP437, please send:
    // 0x1C 0x2E ——set it as the single-byte encoding type
    // 0x1B 0x74 0x00 ——set it as the CP437 of the single-byte code page
    //
    // To print CP866, please send:
    // 0x1C 0x2E ——set it as the single-byte encoding type
    // 0x1B 0x74 0x11 ——set it as the CP866 of the single-byte code page
    //
    // To print traditional characters, please send:
    // 0x1C 0x26 ——set it as the multiple-byte encoding type
    // 0x1C 0x43 0x01—— set it as the BIG5 encoding of the multiple-byte code page
    //
    // To print UTF-8 encoding content (all Unicode character sets are supportedif usingUTF-8 encoding, and all content can be printed), please send:
    // 0x1C 0x26 ——set it as the multiple-byte encoding type
    // 0x1C 0x43 0xFF—— Set it as the UTF-8 encoding of the multiple-type codepage
    encoder.raw([0x1c, 0x2e]).raw([0x1b, 0x74, 0x00]);
  }

  encoder.align('center').height(2);

  encoder
    .rule()
    .width(2)
    .bold(true)
    .line(`#${order.number}`)
    .newline()
    .width(1)
    .bold(false)
    .line(
      i18n.t('RECEIPT_CUSTOMER_NAME', {
        customer: order.customer.fullName || order.customer.email,
      }),
    )
    .rule();

  encoder
    .line(pickupLineDate)
    .newline()
    .width(2)
    .bold(true)
    .line(pickupLineTime)
    .rule()
    .newline();

  encoder.width(1).bold(false);

  order.items.forEach(item => {
    const price = formatPriceWithCode(item.total);

    encoder.table(
      [
        { width: maxChars - price.length - 2, align: 'left', marginRight: 2 },
        { width: price.length, align: 'right' },
      ],
      [[`${item.quantity} x ${diacritics.remove(item.name)}`, price]],
    );

    encoder.align('left');

    if (item.adjustments.hasOwnProperty('menu_item_modifier')) {
      item.adjustments.menu_item_modifier.forEach(adjustment => {
        encoder.line(`- ${fixMultiplySymbol(adjustment.label)}`);
      });
    }

    if (item.adjustments.hasOwnProperty('reusable_packaging')) {
      item.adjustments.reusable_packaging.forEach(adjustment => {
        encoder.line(`- ${fixMultiplySymbol(adjustment.label)}`);
      });
    }

    encoder.newline();
  });

  encoder.line(hr);

  const total = formatPriceWithCode(order.itemsTotal);
  const totalLine =
    i18n.t('TOTAL').padEnd(maxChars - total.length, ' ') + total;

  encoder.align('left').line(totalLine).line(hr);

  if (
    order.adjustments.hasOwnProperty('delivery') &&
    Array.isArray(order.adjustments.delivery)
  ) {
    order.adjustments.delivery.forEach(adjustment => {
      const amount = formatPriceWithCode(adjustment.amount);
      const line =
        i18n.t('TOTAL_DELIVERY').padEnd(maxChars - amount.length, ' ') + amount;
      encoder.align('left').line(line).line(hr);
    });
  }

  if (order.notes) {
    let notes = diacritics.remove(order.notes);
    encoder.line(notes).line(hr);
  }

  encoder.newline().newline().newline();

  return encoder.encode();
}

export function resolveFulfillmentMethod(order) {
  if (Object.prototype.hasOwnProperty.call(order, 'fulfillmentMethod')) {
    return order.fulfillmentMethod;
  }

  if (Object.prototype.hasOwnProperty.call(order, 'takeaway')) {
    return order.takeaway ? 'collection' : 'delivery';
  }

  return 'delivery';
}

export function matchesDate(order, date) {
  return (
    moment(order.pickupExpectedAt).format('YYYY-MM-DD') ===
    moment(date).format('YYYY-MM-DD')
  );
}

export function isMultiVendor(order) {
  const itemsGroupedByVendor = _.groupBy(order.items, 'vendor.@id');

  return _.size(itemsGroupedByVendor) > 1;
}

export function isFree(order) {
  return order.items.length > 0 && order.itemsTotal > 0 && order.total === 0;
}
