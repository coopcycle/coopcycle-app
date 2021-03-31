import moment from 'moment'
import EscPosEncoder from 'esc-pos-encoder'
import diacritics from 'diacritics'
import _ from 'lodash'

import i18n from '../i18n'

import { formatPriceWithCode } from './formatting'

function splitter(str, l){
  var strs = [];
  while (str.length > l){
    var pos = str.substring(0, l).lastIndexOf(' ');
    pos = pos <= 0 ? l : pos;
    strs.push(str.substring(0, pos));
    var i = str.indexOf(' ', pos) + 1;
    if (i < pos || i > pos + l)
        {i = pos;}
    str = str.substring(i);
  }
  strs.push(str);
  return strs;
}

const CODEPAGE = 'windows1251'

export function encodeForPrinter(order) {
  const maxChars = 32

  const pickupLine = i18n.t('RECEIPT_HEADING_PICKUP_EXPECTED_AT', {
    time: moment(order.pickupExpectedAt).format('LT'),
  })

  const hr = ''.padEnd(maxChars, '-')

  let encoder = new EscPosEncoder()
  encoder
    .initialize()
    .codepage(CODEPAGE)
    .line(hr)
    .align('center')
    .line(i18n.t('RECEIPT_HEADING_ORDER_NUMBER', { number: order.number, id: order.id }))
    .line(hr)

  encoder
    .align('center')
    .line(pickupLine)
    .line(hr)
    .newline()

  order.items.forEach((item) => {

    let price = `  ${formatPriceWithCode(item.total)}`
    let name = diacritics.remove(item.name)

    name = `${item.quantity} x ${name}`

    let padding = price.length
    let maxLength = maxChars - padding

    encoder.align('left')

    let lines = splitter(name, maxLength)

    lines.forEach((line, index) => {
      if (index === 0) {
        line = line.padEnd(maxLength, ' ')
        encoder.line(`${line}${price}`)
      } else {
        encoder.line(line)
      }
    })

    if (item.adjustments.hasOwnProperty('menu_item_modifier')) {
      item.adjustments.menu_item_modifier.forEach((adjustment) => {
        encoder.line(`- ${adjustment.label}`)
      })
    }

    encoder.newline()

  })

  encoder
    .line(hr)

  let total = formatPriceWithCode(order.itemsTotal)
  let totalLine = 'TOTAL '.padEnd((maxChars - total.length), ' ') + total

  encoder
    .align('left')
    .line(totalLine)
    .line(hr)

  if (order.notes) {
    let notes = diacritics.remove(order.notes)
    encoder
      .line(notes)
      .line(hr)
  }

  encoder
    .newline()
    .newline()
    .newline()

  return encoder.encode()
}

export function resolveFulfillmentMethod(order) {
  if (Object.prototype.hasOwnProperty.call(order, 'fulfillmentMethod')) {

    return order.fulfillmentMethod
  }

  if (Object.prototype.hasOwnProperty.call(order, 'takeaway')) {

    return order.takeaway ? 'collection' : 'delivery'
  }

  return 'delivery'
}

export function matchesDate(order, date) {

  return moment(order.pickupExpectedAt).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD')
}

export function isMultiVendor(order) {
  const itemsGroupedByVendor = _.groupBy(order.items, 'vendor.@id')

  return _.size(itemsGroupedByVendor) > 1
}
