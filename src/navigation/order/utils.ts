import { TFunction } from 'i18next';
import Task, { TaskMetadata } from '../../types/task';
import { Tasks } from '../../types/tasks';

/**
 * Gets the organization name from the first task that has an orgName
 * @param tasks Array of Task objects
 * @returns The first orgName found, or null if none found
 */
export function getOrderTitle(tasks: Tasks): string | null {
  if (!tasks || !tasks.length) {
    return null;
  }
  const taskWithOrgName = tasks.find(
    task => task.orgName && task.orgName.length > 0,
  );
  return taskWithOrgName ? taskWithOrgName.orgName : null;
}

/**
 * Creates a summary of packages with formatted text and total quantity from tasks
 * Only includes packages from PICKUP tasks, ignores DROPOFF tasks
 * @param tasks Array of Task objects
 * @returns Object containing formatted text and total quantity of all packages from pickup tasks only
 */
// TODO TYPO
export const packagesInOrderSummary = (tasks: Tasks) => {
  if (!tasks || !tasks.length) {
    return { text: '', totalQuantity: 0 };
  }

  const pickupTasks = tasks.filter(task => task.type === 'PICKUP');
  const allPackages = pickupTasks.flatMap(task => task.packages || []);

  if (!allPackages.length) {
    return { text: '', totalQuantity: 0 };
  }

  return allPackages.reduce(
    ({ text, totalQuantity }, p) => {
      const packageText = `${p.quantity} × ${p.name}`;
      text = text.length ? `${text}\n${packageText}` : packageText;
      totalQuantity += p.quantity;
      return { text, totalQuantity };
    },
    { text: '', totalQuantity: 0 },
  );
};

/**
 * Finds the first task that has a value for the specified metadata key
 * @param tasks Array of Task objects
 * @param key The metadata key to search for (payment_method | order_total | etc.)
 * @returns The first value found for the specified key, or null if not found
 */
export const orderInfoInMetadata = <K extends keyof TaskMetadata>(
  tasks: Tasks,
  key: K,
): TaskMetadata[K] | null => {
  if (!tasks || !tasks.length) {
    return null;
  }

  for (const task of tasks) {
    if (task.metadata && task.metadata[key] !== null) {
      return task.metadata[key];
    }
  }

  return null;
};

/**
 * Gets all comments from tasks in the order
 * @param tasks Array of Task objects
 * @returns Array of all comments found in tasks
 */
export const commentsInOrder = (tasks: Tasks): string[] => {
  if (!tasks || !tasks.length) {
    return [];
  }
  return tasks
    .filter(task => task.comments && task.comments.length > 0)
    .map(task => task.comments);
};

/**
 * Gets all unique tags from tasks in the order
 * @param tasks Array of Task objects
 * @returns Array of unique TaskTag objects
 */
export const getUniqueTagsFromTasks = (tasks: Tasks) => {
  if (!tasks || !tasks.length) {
    return [];
  }
  const allTags = tasks.flatMap(task => task.tags || []);
  const uniqueTags = allTags.filter(
    (tag, index, array) => array.findIndex(t => t.slug === tag.slug) === index,
  );

  return uniqueTags;
};

export function getTaskTitleForOrder(task: Task, t: TFunction): string {
  const getFallbackTitle = () =>
    task.type === 'PICKUP' ? t('PICKUP') : t('DROPOFF');

  const addressData = [];
  if (task.address.name) {
    addressData.push(task.address.name);
  }
  if (task.address.contactName) {
    addressData.push(task.address.contactName);
  }
  return addressData.length > 0 ? addressData.join(' - ') : getFallbackTitle();
}

export function formatDistance(
  meters: string | null | undefined,
  options?: {
    decimals?: number;
    locale?: string;
    unitSuffix?: string;
    trimTrailingZeros?: boolean;
  }
): string {
  const { decimals = 2, locale = 'en-US', unitSuffix = ' km', trimTrailingZeros = true } = options ?? {};

  if (!meters) {
    return `0${unitSuffix}`;
  }

  const value = parseFloat(meters);

  if (Number.isNaN(value)) {
    return `0${unitSuffix}`;
  }

  const km = value / 1000;

  const safeDecimals = Math.max(0, Math.floor(Number(decimals) || 0));

  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: trimTrailingZeros ? 0 : safeDecimals,
    maximumFractionDigits: safeDecimals,
  });

  return `${formatter.format(km)}${unitSuffix}`;
}

export function formatDuration(duration: string | null | undefined, t: TFunction) {
  const suffix = `(${t('ESTIMATED_DURATION')})`;
  if(!duration) {return duration}
  const totalSeconds = parseInt(duration, 10);


  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours === 0) {
    return `${minutes}m ${suffix}`;
  } 

  return `${hours}h ${minutes}m ${suffix}`;
}
