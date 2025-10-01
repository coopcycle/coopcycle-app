export function getOrderNumberWithPosition(task) {
  return task.metadata?.delivery_position && task.metadata?.order_number
      ? `${task.metadata.order_number}-${task.metadata.delivery_position}`
      : task.metadata.order_number || '';
}

export function getOrderNumber(task) {
  return task.metadata?.order_number;
}
