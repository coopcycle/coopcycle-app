export function resolveState(delivery) {

  const { pickup, dropoff } = delivery

  if (pickup.hasOwnProperty('status') && dropoff.hasOwnProperty('status')) {
    if (pickup.status === 'TODO' && dropoff.status === 'TODO') {
      return 'new'
    }
    if (pickup.status === 'DONE' && dropoff.status === 'TODO') {
      return 'picked'
    }
    if (pickup.status === 'DONE' && dropoff.status === 'DONE') {
      return 'fulfilled'
    }
  }

  return 'unknown'
}

export function composeWithState(delivery) {

  return {
    ...delivery,
    state: resolveState(delivery),
  }
}

export function stateColor(state) {

  switch (state) {
    case 'new':
      return '#f1c40f'
    case 'picked':
      return '#3498db'
    case 'fulfilled':
      return '#2ecc71'
  }

  return '#bdc3c7'
}
