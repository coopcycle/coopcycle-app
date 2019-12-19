// Source file for common logic related to how task is presented to a user (UI)

const doneIconName = 'check'
const failedIconName = 'remove'

const pickupIconName = 'cube'
const dropOffIconName = 'arrow-down'

const taskTypeIconName = task => task.type === 'PICKUP' ? pickupIconName : dropOffIconName

export {
  doneIconName,
  failedIconName,
  pickupIconName,
  dropOffIconName,
  taskTypeIconName,
}
