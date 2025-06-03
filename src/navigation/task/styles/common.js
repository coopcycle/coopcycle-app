// Source file for common logic related to how task is presented to a user (UI)

const assignOrderIconName = 'cube';
const assignTaskIconName = 'user-circle';
const commentsIconName = 'comments';
const doingIconName = 'play';
const doneIconName = 'check';
const failedIconName = 'remove';
const incidentIconName = 'exclamation-triangle';

const pickupIconName = 'cube';
const dropOffIconName = 'arrow-down';

const taskTypeIconName = task =>
  task.type === 'PICKUP' ? pickupIconName : dropOffIconName;

export {
  assignOrderIconName,
  assignTaskIconName,
  commentsIconName,
  doingIconName,
  doneIconName,
  dropOffIconName,
  failedIconName,
  incidentIconName,
  pickupIconName,
  taskTypeIconName,
};
