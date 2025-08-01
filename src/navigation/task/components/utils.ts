import moment from 'moment';

export const getOrderTimeFrame = tasks => {
  return (
    moment(tasks[0].doneAfter).format('LT') +
    ' - ' +
    moment(tasks[tasks.length - 1].doneBefore).format('LT')
  );
};

export const getTimeFrame = task => {
  return (
    moment(task.doneAfter).format('LT') +
    ' - ' +
    moment(task.doneBefore).format('LT')
  );
};

export const getAddress = task => {
  return task.address.name
    ? [task.address.name, task.address.streetAddress].join(' - ')
    : task.address.streetAddress;
};

export const getName = task => {
  return [task.address.firstName, task.address.lastName]
    .filter(function (item) {
      return item;
    })
    .join(' ');
};
