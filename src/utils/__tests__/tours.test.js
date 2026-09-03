import {
  EMPTY_TOURS_INDEX,
  countCompletedTasks,
  groupTasksByTour,
  isTour,
  splitTaskListItems,
} from '../tours';

const task = (id, status = 'TODO') => ({
  '@id': `/api/tasks/${id}`,
  '@type': 'Task',
  id,
  status,
});

const tour = (id, name, tasks) => ({
  '@id': `/api/tours/${id}`,
  '@type': 'Tour',
  id,
  name,
  items: tasks,
});

describe('isTour', () => {
  it('recognises a tour by its @type', () => {
    expect(isTour(tour(1, 'Centre-ville', []))).toBe(true);
  });

  it('does not mistake a task for a tour', () => {
    expect(isTour(task(1))).toBe(false);
  });

  it('copes with a missing item', () => {
    expect(isTour(undefined)).toBe(false);
    expect(isTour(null)).toBe(false);
  });
});

describe('splitTaskListItems', () => {
  // The case that matters most: an instance that does not support tours yet
  // ignores "?tours=1" and answers with the flat list it always did.
  it('returns a flat payload unchanged, with no tours', () => {
    const items = [task(1), task(2)];

    const { tasks, tours } = splitTaskListItems(items);

    expect(tasks).toEqual(items);
    expect(tours).toEqual(EMPTY_TOURS_INDEX);
  });

  it('flattens tours while indexing which tour each task belongs to', () => {
    const { tasks, tours } = splitTaskListItems([
      task(4),
      tour(1, 'Centre-ville', [task(1), task(2)]),
    ]);

    expect(tasks.map(t => t.id)).toEqual([4, 1, 2]);
    expect(tours.tours).toEqual({
      '/api/tours/1': { '@id': '/api/tours/1', name: 'Centre-ville' },
    });
    expect(tours.tasks).toEqual({
      '/api/tasks/1': '/api/tours/1',
      '/api/tasks/2': '/api/tours/1',
    });
  });

  it('preserves the order the server sent, tours included', () => {
    const { tasks } = splitTaskListItems([
      tour(1, 'A', [task(10), task(11)]),
      task(20),
      tour(2, 'B', [task(30)]),
    ]);

    expect(tasks.map(t => t.id)).toEqual([10, 11, 20, 30]);
  });

  it('copes with an empty tour and with no items at all', () => {
    expect(splitTaskListItems([]).tasks).toEqual([]);
    expect(splitTaskListItems(undefined).tasks).toEqual([]);

    const { tasks, tours } = splitTaskListItems([tour(1, 'Empty', undefined)]);
    expect(tasks).toEqual([]);
    expect(tours.tours['/api/tours/1']).toBeDefined();
  });
});

describe('groupTasksByTour', () => {
  it('renders every task on its own when there is no tour', () => {
    const tasks = [task(1), task(2)];

    expect(groupTasksByTour(tasks, EMPTY_TOURS_INDEX)).toEqual([
      { type: 'task', key: '/api/tasks/1', task: tasks[0] },
      { type: 'task', key: '/api/tasks/2', task: tasks[1] },
    ]);
  });

  it('defaults to no grouping when no index is given', () => {
    expect(groupTasksByTour([task(1)])).toEqual([
      { type: 'task', key: '/api/tasks/1', task: task(1) },
    ]);
  });

  it('groups a tour and keeps bare tasks around it', () => {
    const { tasks, tours } = splitTaskListItems([
      task(4),
      tour(1, 'Centre-ville', [task(1), task(2)]),
      task(5),
    ]);

    const sections = groupTasksByTour(tasks, tours);

    expect(sections.map(s => s.type)).toEqual(['task', 'tour', 'task']);
    expect(sections[1].tour.name).toBe('Centre-ville');
    expect(sections[1].tasks.map(t => t.id)).toEqual([1, 2]);
  });

  it('keeps two tours apart', () => {
    const { tasks, tours } = splitTaskListItems([
      tour(1, 'A', [task(1)]),
      tour(2, 'B', [task(2)]),
    ]);

    const sections = groupTasksByTour(tasks, tours);

    expect(sections).toHaveLength(2);
    expect(sections.map(s => s.tour.name)).toEqual(['A', 'B']);
  });

  // Filtering (search, hidden statuses) only ever removes tasks, so the
  // remaining ones stay contiguous and the tour survives with fewer rows.
  it('keeps the group when a filter removed some of the tour tasks', () => {
    const { tours } = splitTaskListItems([
      tour(1, 'Centre-ville', [task(1), task(2), task(3)]),
    ]);

    const sections = groupTasksByTour([task(1), task(3)], tours);

    expect(sections).toHaveLength(1);
    expect(sections[0].tasks.map(t => t.id)).toEqual([1, 3]);
  });

  it('drops a tour whose tasks were all filtered out', () => {
    const { tours } = splitTaskListItems([tour(1, 'Gone', [task(1)])]);

    expect(groupTasksByTour([], tours)).toEqual([]);
  });

  // A task pushed by the websocket before the refetch lands is not in the
  // index yet; it must render as a plain row rather than break the list.
  it('renders a task missing from the index as a bare task', () => {
    const { tours } = splitTaskListItems([tour(1, 'A', [task(1)])]);

    const sections = groupTasksByTour([task(1), task(99)], tours);

    expect(sections.map(s => s.type)).toEqual(['tour', 'task']);
  });

  it('ignores an index entry pointing at a tour that is gone', () => {
    const staleIndex = {
      tours: {},
      tasks: { '/api/tasks/1': '/api/tours/404' },
    };

    expect(groupTasksByTour([task(1)], staleIndex)).toEqual([
      { type: 'task', key: '/api/tasks/1', task: task(1) },
    ]);
  });
});

describe('countCompletedTasks', () => {
  it('counts done and failed tasks as finished', () => {
    const tasks = [
      task(1, 'DONE'),
      task(2, 'FAILED'),
      task(3, 'TODO'),
      task(4, 'DOING'),
    ];

    expect(countCompletedTasks(tasks)).toBe(2);
  });

  it('returns 0 for an empty tour', () => {
    expect(countCompletedTasks([])).toBe(0);
  });
});
