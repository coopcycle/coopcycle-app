import { Task } from '../types/task';
import { Uri } from '../redux/api/types';

/**
 * A Tour, as returned by `GET /api/me/tasks/{date}?tours=1`.
 *
 * Tours are opt-in: the backend only nests them when the client asks for them,
 * and a server older than that flag ignores it and answers with a flat list of
 * tasks. So every consumer here has to cope with a payload holding no tour at
 * all — that is the normal case against an instance that hasn't upgraded.
 */
export interface Tour {
  '@id': Uri;
  '@type': 'Tour';
  id: number;
  name: string;
  items: Task[];
}

export type TaskListItem = Task | Tour;

/**
 * The tours of one day.
 *
 * `tasks` maps a task IRI to the IRI of the tour holding it, mirroring the
 * index dispatch already builds in `selectToursTasksIndex`.
 */
export interface ToursIndex {
  tours: Record<Uri, TourSummary>;
  tasks: Record<Uri, Uri>;
}

export interface TourSummary {
  '@id': Uri;
  name: string;
}

export const EMPTY_TOURS_INDEX: ToursIndex = Object.freeze({
  tours: {},
  tasks: {},
});

export function isTour(item: TaskListItem | null | undefined): item is Tour {
  return item?.['@type'] === 'Tour';
}

/**
 * Splits the items of a task list into a flat, ordered list of tasks, plus an
 * index of the tours they belong to.
 *
 * Keeping the tasks flat is deliberate: every existing selector, filter, map
 * screen and reducer keeps seeing exactly the shape it saw before, and the tour
 * grouping is layered on top purely for display. It also means a response with
 * no tours in it produces the pre-existing state, unchanged.
 */
export function splitTaskListItems(items: TaskListItem[] = []): {
  tasks: Task[];
  tours: ToursIndex;
} {
  const tasks: Task[] = [];
  const tours: Record<Uri, TourSummary> = {};
  const taskToTour: Record<Uri, Uri> = {};

  for (const item of items) {
    if (!isTour(item)) {
      tasks.push(item);
      continue;
    }

    const tourId = item['@id'];
    tours[tourId] = { '@id': tourId, name: item.name };

    for (const task of item.items ?? []) {
      taskToTour[task['@id']] = tourId;
      tasks.push(task);
    }
  }

  return { tasks, tours: { tours, tasks: taskToTour } };
}

export type TaskListSection =
  | { type: 'task'; key: string; task: Task }
  | { type: 'tour'; key: string; tour: TourSummary; tasks: Task[] };

/**
 * Rebuilds the tour grouping from a flat list of tasks.
 *
 * Groups *consecutive* runs of tasks sharing a tour: the API returns a tour's
 * tasks contiguously, and nothing downstream re-sorts the courier list, so a
 * run cannot be split. Filtering only ever removes tasks, which keeps the
 * remaining ones contiguous too. Grouping positionally rather than by identity
 * means the courier always sees the rows in the order the server sent them.
 */
export function groupTasksByTour(
  tasks: Task[],
  index: ToursIndex = EMPTY_TOURS_INDEX,
): TaskListSection[] {
  const sections: TaskListSection[] = [];

  for (const task of tasks) {
    const tourId = index.tasks[task['@id']];
    const tour = tourId ? index.tours[tourId] : undefined;

    if (!tour) {
      sections.push({ type: 'task', key: task['@id'], task });
      continue;
    }

    const last = sections[sections.length - 1];

    if (last?.type === 'tour' && last.tour['@id'] === tourId) {
      last.tasks.push(task);
      continue;
    }

    sections.push({
      // A tour interrupted by a task filtered back in could legitimately open a
      // second run, so the first task keeps the key unique.
      key: `${tourId}-${task['@id']}`,
      type: 'tour',
      tour,
      tasks: [task],
    });
  }

  return sections;
}

/**
 * How many of the tour's tasks are finished, for the header's "2/5" badge.
 */
export function countCompletedTasks(tasks: Task[]): number {
  return tasks.filter(
    task => task.status === 'DONE' || task.status === 'FAILED',
  ).length;
}
