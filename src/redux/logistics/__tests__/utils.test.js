import {
  getTaskWithHasIncidents,
  getTaskWithStatus,
} from '../../../shared/src/logistics/redux/testsUtils';
import {
  filterByTag,
  filterUntagged,
  filterHasIncidents,
  filterStatusDone,
  filterStatusFailed,
} from '../filters';
import { filterTasks } from '../utils';

describe('Logistics - utils', () => {
  describe('filterTasks', () => {
    const tasks = [
      getTaskWithStatus('DONE'),
      getTaskWithStatus('DONE'),
      getTaskWithStatus('FAILED'),
      getTaskWithStatus('FAILED'),
      getTaskWithHasIncidents(false),
      getTaskWithHasIncidents(false),
      getTaskWithHasIncidents(true),
      getTaskWithHasIncidents(true),
    ];

    it('should return all tasks if there are no filters', () => {
      const filters = [];

      const result = filterTasks(tasks, filters);

      expect(result).toEqual(tasks);
    });

    it.each([
      [[filterStatusDone], tasks.slice(2, 8)],
      [[filterStatusFailed], [...tasks.slice(0, 2), ...tasks.slice(4, 8)]],
      [[filterHasIncidents], tasks.slice(0, 6)],
    ])(
      'should return all tasks if there is one filter',
      (filters, expectedResult) => {
        const result = filterTasks(tasks, filters);

        expect(result).toEqual(expectedResult);
      },
    );

    it.each([
      [[filterStatusDone, filterStatusFailed], tasks.slice(4, 8)],
      [[filterStatusDone, filterHasIncidents], tasks.slice(2, 6)],
      [
        [filterStatusFailed, filterHasIncidents],
        [...tasks.slice(0, 2), ...tasks.slice(4, 6)],
      ],
      [
        [filterStatusDone, filterStatusFailed, filterHasIncidents],
        tasks.slice(4, 6),
      ],
    ])(
      'should return all tasks if there is multiple filter',
      (filters, expectedResult) => {
        const result = filterTasks(tasks, filters);

        expect(result).toEqual(expectedResult);
      },
    );
  });

  describe('filterTasks, by tag', () => {
    const task = (id, ...tagNames) => ({
      id,
      status: 'TODO',
      tags: tagNames.map(name => ({ name })),
    });

    const tasks = [
      task(1, 'CLIENTS'),
      task(2, 'HOPE'),
      task(3, 'CLIENTS', 'HOPE'),
      task(4),
    ];

    const idsLeft = filters => filterTasks(tasks, filters).map(t => t.id);

    it('hides the tasks carrying the hidden tag', () => {
      expect(idsLeft([filterByTag('HOPE')])).toEqual([1, 3, 4]);
    });

    it('keeps a task as long as one of its tags is shown', () => {
      expect(idsLeft([filterByTag('HOPE')])).toContain(3);
    });

    it('hides a task once all of its tags are hidden', () => {
      expect(idsLeft([filterByTag('HOPE'), filterByTag('CLIENTS')])).toEqual([
        4,
      ]);
    });

    it('never hides an untagged task on tag rules alone', () => {
      expect(idsLeft([filterByTag('HOPE'), filterByTag('CLIENTS')])).toContain(
        4,
      );
    });

    it('hides the untagged tasks on the untagged rule', () => {
      expect(idsLeft([filterByTag('HOPE'), filterUntagged])).toEqual([1, 3]);
    });

    it('leaves a soloed tag on its own', () => {
      expect(
        idsLeft([filterByTag('HOPE'), filterByTag('BIOCOOP'), filterUntagged]),
      ).toEqual([1, 3]);
    });

    it('still applies the other filters', () => {
      expect(
        filterTasks(
          [...tasks, { id: 5, status: 'DONE', tags: [] }],
          [filterStatusDone, filterByTag('HOPE')],
        ).map(t => t.id),
      ).toEqual([1, 3, 4]);
    });
  });
});
