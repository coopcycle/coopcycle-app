import Task from '@/src/types/task';
import moment from 'moment';
import { timezoneMoment } from '@/src/utils/timezone';

// Task time frames are wall-clock times in the server's timezone; rendering
// them with the device timezone shows the wrong hour to anyone working from
// another timezone. Pass the timezone from `selectTimezone`.
export const addDayIfNotToday = (date, separator=' ', timezone?: string) => {
  const day = timezoneMoment(date, timezone);
  return day.format('YYYYMMDD') === timezoneMoment(moment(), timezone).format('YYYYMMDD') ? '' : `(${day.format('MMM Do')})${separator}`;
}

export const formatTime = (date, timezone?: string) => {
  return timezoneMoment(date, timezone).format('HH:mm');
}

export const getOrderTimeFrame = (tasks, timezone?: string) => {
  return (
    addDayIfNotToday(tasks[0].doneAfter, ' ', timezone) +
    formatTime(tasks[0].doneAfter, timezone) +
    ' - ' +
    formatTime(tasks[tasks.length - 1].doneBefore, timezone)
  );
};

export const getTimeFrame = (task, timezone?: string) => {
  return (
    formatTime(task.doneAfter, timezone) +
    ' - ' +
    formatTime(task.doneBefore, timezone)
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

export const moveAfter = (tasks: Task[], fromIndex: number, toIndex: number) => {
  const out = [...tasks];
  const [item] = out.splice(fromIndex, 1);

  const adjustedTarget = fromIndex > toIndex ? toIndex : toIndex - 1;
  const insertPos = Math.max(0, Math.min(out.length, adjustedTarget + 1));

  out.splice(insertPos, 0, item);
  return out;
};

export const isDropoff = (task: Task, tasks: Task[]) => {
  if (tasks && tasks.length > 1) {
    return tasks.every(t => t.type === 'DROPOFF');
  } else if (tasks && tasks.length === 1) {
    return tasks[0].type === 'DROPOFF';
  }
  return task && task.type === 'DROPOFF';
}