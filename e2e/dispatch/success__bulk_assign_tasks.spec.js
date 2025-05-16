import {
  bulkAssignTaskToUser,
  doLoginForUserWithRoleDispatcher,
  loadDispatchFixture,
} from './utils';
import { itif } from '../utils';

const USERNAME = 'jane';

describe('Dispatch - Bulk assign tasks', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    await loadDispatchFixture();
    await doLoginForUserWithRoleDispatcher();
  });

  itif(device.getPlatform() === 'android')(
    'should assing two tasks to a courier',
    async () => {
      await bulkAssignTaskToUser(USERNAME);

      // Verify task is on Jane's task list
      await expect(element(by.id('janeTasksList:task:0'))).toBeVisible();
      await expect(element(by.id('janeTasksList:task:1'))).toBeVisible();
    },
  );
});
