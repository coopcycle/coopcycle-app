import {
  assignTaskToUser,
  doLoginForUserWithRoleDispatcher,
  loadDispatchFixture,
  unassignTaskFromUser,
} from './utils';
import { itif } from '../utils';

const USERNAME = 'jane';

describe('Dispatch - Assing and unassign tasks', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    await loadDispatchFixture();
    await doLoginForUserWithRoleDispatcher();
  });

  itif(device.getPlatform() === 'android')(
    'should assing a single task to a courier and then unassign it',
    async () => {
      await assignTaskToUser(USERNAME);

      // Verify task is on Jane's task list
      await expect(element(by.id('janeTasksList:task:0'))).toBeVisible();

      // Unassign the task
      await unassignTaskFromUser(USERNAME);

      // Verify all tasks are unassigned
      await expect(element(by.id('unassignedTasksList:task:0'))).toBeVisible()
      await expect(element(by.id('unassignedTasksList:task:1'))).toBeVisible()
    },
  );
});
