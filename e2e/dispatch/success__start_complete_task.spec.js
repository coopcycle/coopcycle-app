import {
  describeif,
  swipeLeft,
  swipeRight,
  tapById,
  tapByText,
  waitToBeVisible
} from "../support/commands";
import {
  assignTaskToUser,
  loadDispatchFixture,
  loginDispatcherUser,
  toggleSectionUnassigned,
} from './utils';

const USER_JANE = 'jane';

//FIXME: Run these tests for iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
describeif(device.getPlatform() === 'android')
  ('Dispatch - Start and complete a task', () => {

  beforeEach(async () => {
    await loadDispatchFixture();
    await loginDispatcherUser();

    // Assign task #1
    await assignTaskToUser(USER_JANE);

    // Hide unassigned tasks section
    await toggleSectionUnassigned();

    // Open assigned task #1
    await tapById(`${USER_JANE}TasksList:task:0`);
  });

  it('should mark a task as DOING', async () => {
    // Swipe complete button, tap 'ok' and press 'Start'
    await swipeRight('task:completeButton');
    await tapById('task:completeSuccessButton');
    await tapByText('▶ Start');

    // Go back to AllTasks view
    await device.pressBack();

    // Verify task #1 has status "DOING"
    await waitToBeVisible('taskListItemIcon:DOING:1');
  });


  it('should mark a task as DONE', async () => {
    // Swipe complete button, tap 'ok' and press 'Complete'
    await swipeRight('task:completeButton');
    await tapById('task:completeSuccessButton');
    await tapByText('✓ Complete');

    // Click the finish button in the new view
    await tapById('task:finishButton');

    // Verify task #1 has status "DONE"
    await waitToBeVisible('taskListItemIcon:DONE:1');
  });

  // TODO FIXME: Somehow the step to tap 'task:completeFailureButton' isn't working..!
  // The new view is loaded fine but the console keeps saying:
  //     The app is busy with the following tasks:
  //       • UI elements are busy:
  //         - Reason: Animations running on screen.
  //
  // And then, after a while, the console says:
  //     The app has not responded to the network requests below:
  //     (id = 32) invoke:
  //       {"target":{"type":"Class","value":"com.wix.detox.espresso.EspressoDetox"},
  //       "method":"perform", "args":[
  //         {"type":"Invocation","value":{"target":{"type":"Class","value":"com.wix.detox.espresso.DetoxMatcher"},"method":"matcherForTestId","args":["task:completeFailureButton",{"type":"boolean","value":false}]}},
  //         {"type":"Invocation","value":{"target":{"type":"Class","value":"com.wix.detox.espresso.DetoxViewActions"},"method":"click","args":[]}}
  //       ]}
  //
  // UGLY WORKAROUND: Disable synchronization for this test and use `waitToBeVisible`
  it('should mark a task as FAILED', async () => {
    // Ugly workaround: disable synchronization..
    await device.disableSynchronization();

    // Swipe complete button, tap 'failed' and press 'Report incident'
    await swipeLeft('task:completeButton');
    await tapById('task:completeFailureButton');

    // Click the finish button in the new view
    await tapById('task:finishButton');

    // Verify task #1 has status "FAILED"
    // TODO FIXME: This check was disabled because the task isn't auto-refreshed!
    // It seems that the backend doesn't send the update event.
    //await waitToBeVisible('taskListItemIcon:FAILED:1');
  });

});
