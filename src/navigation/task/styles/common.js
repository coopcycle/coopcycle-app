// Source file for common logic related to how task is presented to a user (UI)

const doingIconName = 'play'
const doneIconName = 'check'
const failedIconName = 'remove'
const incidentIconName = 'exclamation-triangle'

const pickupIconName = 'cube'
const dropOffIconName = 'arrow-down'

const taskTypeIconName = task => task.type === 'PICKUP' ? pickupIconName : dropOffIconName

export {
  doingIconName,
  doneIconName,
  failedIconName,
  incidentIconName,
  pickupIconName,
  dropOffIconName,
  taskTypeIconName,
}
