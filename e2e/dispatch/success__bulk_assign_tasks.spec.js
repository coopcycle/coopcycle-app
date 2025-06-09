import {
  bulkAssignTaskToUser,
  doLoginForUserWithRoleDispatcher,
  loadDispatchFixture,
  toggleSection,
} from './utils';
import { itif } from '../utils';
import { UNASSIGNED_TASKS_LIST_ID } from '../../src/shared/src/constants';

const USERNAME = 'jane';

describe('Dispatch - Bulk assign tasks', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    await loadDispatchFixture();
    await doLoginForUserWithRoleDispatcher();
  });

  itif(device.getPlatform() === 'android')(
    'should assign two tasks to a courier',
    async () => {
      await bulkAssignTaskToUser(USERNAME);

      // Hide unassigned tasks section
      await toggleSection(UNASSIGNED_TASKS_LIST_ID);

      // Verify task is on USERNAME's task list
      await expect(element(by.id(`${USERNAME}TasksList:task:0`))).toBeVisible();
      await expect(element(by.id(`${USERNAME}TasksList:task:1`))).toBeVisible();
    },
  );
});
