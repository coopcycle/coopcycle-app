export function getNameFromId(formatId, formats) {
  const format = formats.find(f => f.id === formatId)
  return format.title
}

export function getPriceFromId(formatId, formats) {
  const format = _.find(formats, f => f.id === formatId)
  return format.cost_cents
}

export const getReturnsTotalAmount = (returns, formats) => returns.reduce(
  (total, container) => total + (getPriceFromId(container.format_id, formats) * container.quantity),
  0
)

export function getMissingAmount({ requiredAmount, creditsCountCents, returns, formats }) {
  const returnsTotalAmount = getReturnsTotalAmount(returns, formats)
  return requiredAmount - (creditsCountCents + returnsTotalAmount)
}
