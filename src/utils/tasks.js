export function getOrderIdWithPosition(task) {
  const id =
    task.metadata?.delivery_position && task.metadata?.order_number
      ? `${task.metadata.order_number}-${task.metadata.delivery_position}`
      : task.metadata.order_number || '';

  return id;
}

export function getOrderId(task) {
  return task.metadata?.order_number
}