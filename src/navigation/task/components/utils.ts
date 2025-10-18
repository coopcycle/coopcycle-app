import moment from 'moment';

export const addDayIfNotToday = (date, separator=' ') => {
  return moment(date).format('YYYYMMDD') === moment().format('YYYYMMDD') ? '' : `(${moment(date).format('MMM Do')})${separator}`;
}

export const formatTime = (date) => {
  return moment(date).format('HH:mm');
}

export const getOrderTimeFrame = tasks => {
  return (
    addDayIfNotToday(tasks[0].doneAfter) +
    formatTime(tasks[0].doneAfter) +
    ' - ' +
    formatTime(tasks[tasks.length - 1].doneBefore)
  );
};

export const getTimeFrame = task => {
  return (
    formatTime(task.doneAfter) +
    ' - ' +
    formatTime(task.doneBefore)
  );
};

export const getAddress = task => {
  return task.address.name
    ? [task.address.name, task.address.streetAddress].join(' - ')
    : task.address.streetAddress;
};

export const getName = task => {
  return [task.address.firstName, task.address.lastName]
    .filter(item => !!item)
    .join(' ');
};

export const getPackagesSummary = task => {
  if (!task.packages || !task.packages.length) {
    return { text: '', totalQuantity: 0 };
  }

  return task.packages.reduce(
    ({ text, totalQuantity }, p) => {
      const packageText = `${p.quantity} × ${p.name}`;
      text = text.length ? `${text}\n${packageText}` : packageText;
      totalQuantity += p.quantity;
      return { text, totalQuantity };
    },
    { text: '', totalQuantity: 0 },
  );
};
