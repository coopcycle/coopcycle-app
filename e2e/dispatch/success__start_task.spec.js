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
describeif(device.getPlatform() === 'android')('Dispatch - Start a task', () => {

  beforeEach(async () => {
    await device.reloadReactNative();
    await loadDispatchFixture();
    await doLoginForUserWithRoleDispatcher();
    await assignTaskToUser(USERNAME);
  });

  it('should mark a task as started', async () => {
      // Open assigned task
      await tapById(`${USERNAME}TasksList:task:0`);

      // Swipe complete button, tap ok and press 'Start'
      await swipeRight('task:completeButton');
      await tapById('task:completeSuccessButton');
      await tapByText('▶ Start');

      // Go back to All Tasks view
      await device.pressBack();

      // Verify task has status "DOING"
      await expect(element(by.id('taskListItemIcon-DOING'))).toBeVisible();
  });
});
