import { getTaskWithHasIncidents, getTaskWithStatus } from "../../../shared/src/logistics/redux/testsUtils";
import { filterHasIncidents, filterStatusDone, filterStatusFailed } from "../filters";
import { filterTasks } from "../utils";

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
    ])('should return all tasks if there is one filter', (filters, expectedResult) => {
      const result = filterTasks(tasks, filters);

      expect(result).toEqual(expectedResult);
    });

    it.each([
      [[filterStatusDone, filterStatusFailed], tasks.slice(4, 8)],
      [[filterStatusDone, filterHasIncidents], tasks.slice(2, 6)],
      [[filterStatusFailed, filterHasIncidents], [...tasks.slice(0, 2), ...tasks.slice(4, 6)]],
      [[filterStatusDone, filterStatusFailed, filterHasIncidents], tasks.slice(4, 6)],
    ])('should return all tasks if there is multiple filter', (filters, expectedResult) => {
      const result = filterTasks(tasks, filters);

      expect(result).toEqual(expectedResult);
    });
  });
});
