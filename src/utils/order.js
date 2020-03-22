import moment from 'moment'
import EscPosEncoder from 'esc-pos-encoder'
import diacritics from 'diacritics'

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

  const preparationExpectedAt = moment(order.preparationExpectedAt).format('LT')
  const pickupExpectedAt = moment(order.pickupExpectedAt).format('LT')

  const preparationLine = 'A COMMENCER A PARTIR DE '.padEnd((maxChars - preparationExpectedAt.length), ' ') + preparationExpectedAt
  const pickupLine = 'A PREPARER POUR '.padEnd((maxChars - pickupExpectedAt.length), ' ') + pickupExpectedAt

  let encoder = new EscPosEncoder()
  encoder
    .initialize()
    .codepage(CODEPAGE)
    .line(''.padEnd(maxChars, '-'))
    .align('center')
    .line(`COMMANDE ${order.number} #${order.id}`)
    .line(''.padEnd(maxChars, '-'))

  encoder
    .align('left')
    .line(preparationLine)
    .line(pickupLine)
    .line(''.padEnd(maxChars, '-'))
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
    .line(''.padEnd(maxChars, '-'))

  let total = formatPriceWithCode(order.itemsTotal)
  let totalLine = 'TOTAL '.padEnd((maxChars - total.length), ' ') + total

  encoder
    .align('left')
    .line(totalLine)
    .line(''.padEnd(maxChars, '-'))

  if (order.notes) {
    let notes = diacritics.remove(order.notes)
    encoder
      .line(notes)
      .line(''.padEnd(maxChars, '-'))
  }

  encoder
    .newline()
    .newline()
    .newline()

  return encoder.encode()
}
