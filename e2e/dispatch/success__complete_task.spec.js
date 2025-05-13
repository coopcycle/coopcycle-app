import {
  assignTaskToUser,
  doLoginForUserWithRoleDispatcher,
  loadDispatchFixture,
} from './utils';
import {
  describeif,
  swipeRight,
  tapById,
  tapByText,
} from '../utils';

const USERNAME = 'jane';

//FIXME: run these tests for iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
describeif(device.getPlatform() === 'android')('Dispatch - Complete a task', () => {

  beforeEach(async () => {
    await device.reloadReactNative();
    await loadDispatchFixture();
    await doLoginForUserWithRoleDispatcher();
    await assignTaskToUser(USERNAME);
  });

  it('should mark a task as done', async () => {
      // Open assigned task
      await tapById(`${USERNAME}TasksList:task:0`);

      // Swipe complete button, tap ok and press 'Complete'
      await swipeRight('task:completeButton');
      await tapById('task:completeSuccessButton');
      await tapByText('✓ Complete');

      // Press task's complete button
      await tapById('completeTaskButton');

      // Verify task has status "DONE"
      await expect(element(by.id('taskListItemIcon-DONE'))).toBeVisible();
  });
});
