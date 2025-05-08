import {
  assignTaskToUser,
  doLoginForUserWithRoleDispatcher,
  loadDispatchFixture,
} from './utils';
import {
  itif,
  swipeRight,
  tapById,
  tapByText,
} from '../utils';

const USERNAME = 'jane';

describe('Dispatch - Task lifecycle', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    await loadDispatchFixture();
    await doLoginForUserWithRoleDispatcher();
    await assignTaskToUser(USERNAME);
  });

  //FIXME: run these tests for iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
  itif(device.getPlatform() === 'android')(
    `should mark a task as started`,
    async () => {
      // Open jane's task list
      await tapById('dispatch:assignedTab');
      await tapById(`dispatch:taskLists:${USERNAME}`);

      // Open assigned task
      await tapById('task:0:assign');

      // Swipe complete button, tap ok and press 'Start'
      await swipeRight('task:completeButton');
      await tapById('task:completeSuccessButton');
      await tapByText('▶ Start');

      // Go back to jane's task list
      await device.pressBack();

      // Verify task has status "DOING"
      await expect(element(by.id('taskListItemIcon-DOING'))).toBeVisible();
  });
});
