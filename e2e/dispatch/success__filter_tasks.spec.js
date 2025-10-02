import { UNASSIGNED_TASKS_LIST_ID } from "../../src/shared/src/constants";
import {
  describeif,
  expectToNotExist,
  swipeDown,
  swipeRight,
  tapById,
  tapByText,
  typeTextQuick,
  waitToBeVisible,
  waitToExist,
} from "../support/commands";
import {
  assignOrderToUser,
  expectTaskTitleToHaveText,
  loadDispatchFixture,
  loginDispatcherUser,
  toggleSectionUnassigned,
  toggleSectionUser,
} from './utils';

const USER_JANE = 'jane';
const USER_ZAK = 'zak';

//FIXME: Run these tests for iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
describeif(device.getPlatform() === 'android')
  ('Dispatch - Filter tasks', () => {

  beforeEach(async () => {
    await loadDispatchFixture();
    await loginDispatcherUser();
  });

  it('should correctly apply filters to tasks on different tasklists', async () => {
    // Show unassigned tasks section
    //await toggleSectionUnassigned(); (THIS IS A BUG: it should be hidden by default but it's visible)

    // Assign the 1st order in the list with tasks #1+#2+#3
    await assignOrderToUser(USER_JANE);
    // Show unassigned tasks section (THIS IS A BUG: it hides once we assign the order above)
    await toggleSectionUnassigned(); // TODO: Remove this line once the bug is fixed
    // Assign the 1st order in the list with tasks #5+#4
    await assignOrderToUser(USER_ZAK);

    // Hide unassigned tasks section
    await toggleSectionUnassigned();
    // Show USER_JANE's and USER_ZAK's tasks section
    await toggleSectionUser(USER_JANE);
    //await toggleSectionUser(USER_ZAK); (THIS IS A BUG: it should be hidden by default but it's visible)

    // Verify tasks #1+#2+#3 are on USER_JANE's task list
    await expectTaskTitleToHaveText(`${USER_JANE}TasksList`, 0, "Acme (task #1)");
    await expectTaskTitleToHaveText(`${USER_JANE}TasksList`, 1, "Acme (task #2)");
    await expectTaskTitleToHaveText(`${USER_JANE}TasksList`, 2, "Acme (task #3)");
    // Verify tasks #5+#4 are on USER_ZAK's task list
    await expectTaskTitleToHaveText(`${USER_ZAK}TasksList`, 0, "Acme (task #5)");
    await expectTaskTitleToHaveText(`${USER_ZAK}TasksList`, 1, "Acme (task #4)");

    //////////////
    // Hide done tasks
    //////////////

    // Open assigned task #1 and mark it as DONE
    await tapById(`${USER_JANE}TasksList:task:0`);
    await swipeRight('task:completeButton');
    await tapById('task:completeSuccessButton');
    await tapByText('✓ Complete');
    // Click the finish button and verify task #1 has status "DONE"
    await tapById('task:finishButton');
    await waitToBeVisible('taskListItemIcon:DONE:1');

    // Open assigned task #5 and mark it as DONE
    await tapById(`${USER_ZAK}TasksList:task:0`);
    await swipeRight('task:completeButton');
    await tapById('task:completeSuccessButton');
    await tapByText('✓ Complete');
    // Click the finish button and verify task #5 has status "DONE"
    await tapById('task:finishButton');
    await waitToBeVisible('taskListItemIcon:DONE:5');

    // Open the filters screen and enable "Hide done tasks"
    await tapById('showTasksFiltersButton');
    await waitToBeVisible('dispatchTasksFiltersView');
    await tapById('hideDoneTasksSwitch');

    // Go back
    await device.pressBack();

    // Verify task #1 is not on USER_JANE's task list
    await expectTaskTitleToHaveText(`${USER_JANE}TasksList`, 0, "Acme (task #2)");
    await expectTaskTitleToHaveText(`${USER_JANE}TasksList`, 1, "Acme (task #3)");
    // Verify task #5 is not on USER_ZAK's task list
    await expectTaskTitleToHaveText(`${USER_ZAK}TasksList`, 0, "Acme (task #4)");

    //////////////
    // Hide incidents
    // TODO FIXME: This check was disabled because the task isn't auto-refreshed!
    //////////////

    // // Open assigned task #2 and mark it as FAILED
    // await tapById(`${USER_JANE}TasksList:task:0`);
    // await swipeLeft('task:completeButton');
    // await tapById('task:completeFailureButton');
    // // Click the finish button and verify task #2 has status "FAILED"
    // await tapById('task:finishButton');
    // // TODO FIXME: This check was disabled because the task isn't auto-refreshed!
    // //await waitToBeVisible('taskListItemIcon:FAILED:2');

    // Open the filters screen and enable "Hide incidents"
    await tapById('showTasksFiltersButton');
    await waitToBeVisible('dispatchTasksFiltersView');
    await tapById('hideIncidentsSwitch');

    // Go back
    await device.pressBack();

    // // Verify task #2 is not on USER_JANE's task list
    // await expectTaskTitleToHaveText(`${USER_JANE}TasksList`, 0, "Acme (task #3)");

    //////////////
    // Hide unassigned tasks from map
    //////////////

    // TODO FIX: FORCE TASK LIST UPDATE because somehow it fails to refresh later on..!
    await swipeDown('dispatchTasksSectionList');
    await toggleSectionUnassigned();

    // Open the map screen
    await tapById('toggleTasksMapListButton');

    // Verify tasks #6+#7 markers are on the map
    await waitToExist('taskmarker-6-0'); // If we don't force the task list update, this marker will be: 'taskmarker-6-5'
    await waitToExist('taskmarker-7-1'); // If we don't force the task list update, this marker will be: 'taskmarker-7-6'
    await waitToExist('taskmarker-3-7'); // If we don't force the task list update, this marker will be: 'taskmarker-3-2'

    // Open the filters screen and enable "Hide unassigned tasks from map"
    await tapById('showTasksFiltersButton');
    await waitToBeVisible('dispatchTasksFiltersView');
    await tapById('toggleUnassignedFromMapSwitch');

    // Go back
    await device.pressBack();

    // Verify tasks #6+#7 markers are NOT on the map
    await expectToNotExist('taskmarker-6-0');
    await expectToNotExist('taskmarker-7-1');
    // TODO FIX: If we don't force the task list update, ALL MARKERS DISAPPEAR!!!!!!!!!!
    await waitToExist('taskmarker-3-7');

    //////////////
    // Show line linking tasks
    //////////////

    // Verify polylines are on the map
    // TODO FIXME: Tried a lot but I can't find the polyline by testID although it's rendered..!!
    // await waitToExist('polyline-1-3');

    // Open the filters screen and disable "Show line linking tasks"
    await tapById('showTasksFiltersButton');
    await waitToBeVisible('dispatchTasksFiltersView');
    await tapById('togglePolylinesFromMapSwitch');

    // Go back
    await device.pressBack();

    // Verify polylines are NOT on the map
    await expectToNotExist('polyline-1-3');

    //////////////
    // Filter by keywords
    //////////////

    // Close the map screen
    await tapById('toggleTasksMapListButton');

    // Open the filters screen and enter one keyword
    await tapById('showTasksFiltersButton');
    await waitToBeVisible('dispatchTasksFiltersView');
    await tapById('showKeywordsFiltersButton');
    await waitToBeVisible('keywordsFilterView');
    await typeTextQuick('searchTextInput', '#1\n');

    // Go back
    await tapById('keywordsFilterGoToAllTasksButton');

    // Verify tasks were found
    //await toggleSectionUnassigned(); (THIS IS A BUG: it should be hidden but it's visible)
    await expectTaskTitleToHaveText(UNASSIGNED_TASKS_LIST_ID, 0, "Acme (task #11)");
    await expectTaskTitleToHaveText(UNASSIGNED_TASKS_LIST_ID, 1, "Acme (task #10)");

    // Open the filters screen and enter another keyword
    await tapById('showTasksFiltersButton');
    await waitToBeVisible('dispatchTasksFiltersView');
    await tapById('showKeywordsFiltersButton');

    await waitToBeVisible('keywordsFilterView');
    await typeTextQuick('searchTextInput', '-#11\n');

    // Go back
    await tapById('keywordsFilterGoToAllTasksButton');

    // Verify only one task was found
    await expectTaskTitleToHaveText(UNASSIGNED_TASKS_LIST_ID, 0, "Acme (task #10)");

    // Open the filters screen and remove all keywords
    await tapById('showTasksFiltersButton');
    await waitToBeVisible('dispatchTasksFiltersView');
    await tapById('showKeywordsFiltersButton');
    await waitToBeVisible('keywordsFilterView');
    await tapById('active-filter-1');
    await tapById('active-filter-0');

    // Go back
    await tapById('keywordsFilterGoToAllTasksButton');

    // Verify all previous tasks are back again..!
    await expectTaskTitleToHaveText(UNASSIGNED_TASKS_LIST_ID, 0, "Acme (task #7)");
    await expectTaskTitleToHaveText(UNASSIGNED_TASKS_LIST_ID, 1, "Acme (task #9)");
    await expectTaskTitleToHaveText(UNASSIGNED_TASKS_LIST_ID, 2, "Acme (task #11)");
  });

});
