import { UNASSIGNED_TASKS_LIST_ID } from "../../src/shared/src/constants";
import {
  describeif,
  typeTextQuick,
  waitToBeVisible,
} from "../support/commands";
import {
  assignOrderToUser,
  getTaskTitleElement,
  loadDispatchFixture,
  loginDispatcherUser,
  toggleSectionUnassigned,
} from './utils';

const USER_JANE = 'jane';
const USER_ZAK = 'zak';

//FIXME: Run these tests for iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
describeif(device.getPlatform() === 'android')
  ('Dispatch - Search for tasks', () => {

  beforeEach(async () => {
    await loadDispatchFixture();
    await loginDispatcherUser();
  });

  it('should correctly find tasks on different tasklists', async () => {
    // Assign the 1st order in the list with tasks #1+#2+#3
    await assignOrderToUser(USER_JANE);
    // Assign the 1st order in the list with tasks #5+#4
    await assignOrderToUser(USER_ZAK);

    // Hide unassigned tasks section
    await toggleSectionUnassigned();

    // Verify tasks #1+#2+#3 are on USER_JANE's task list
    await expect(getTaskTitleElement(`${USER_JANE}TasksList`, 0)).toHaveText("Acme - Task #1");
    await expect(getTaskTitleElement(`${USER_JANE}TasksList`, 1)).toHaveText("Acme - Task #2");
    await expect(getTaskTitleElement(`${USER_JANE}TasksList`, 2)).toHaveText("Acme - Task #3");
    // Verify tasks #5+#4 are on USER_ZAK's task list
    await expect(getTaskTitleElement(`${USER_ZAK}TasksList`, 0)).toHaveText("Acme - Task #5");
    await expect(getTaskTitleElement(`${USER_ZAK}TasksList`, 1)).toHaveText("Acme - Task #4");

    // Search by username
    await typeTextQuick('searchTextInput', `${USER_JANE}\n`);
    await waitToBeVisible('dispatchTasksSearchResults');

    // Verify tasks #1+#2+#3 were found on USER_JANE's task list
    await expect(getTaskTitleElement(`${USER_JANE}TasksListSearchResults`, 0)).toHaveText("Acme - Task #1");
    await expect(getTaskTitleElement(`${USER_JANE}TasksListSearchResults`, 1)).toHaveText("Acme - Task #2");
    await expect(getTaskTitleElement(`${USER_JANE}TasksListSearchResults`, 2)).toHaveText("Acme - Task #3");

    // Go back
    await device.pressBack();

    // Search by task orgName
    await typeTextQuick('searchTextInput', 'Acme\n');
    await waitToBeVisible('dispatchTasksSearchResults');

    // Verify tasks were found on different task lists
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 0)).toHaveText("Acme - Task #7");
    await expect(getTaskTitleElement(`${USER_JANE}TasksListSearchResults`, 0)).toHaveText("Acme - Task #1");
    await expect(getTaskTitleElement(`${USER_ZAK}TasksListSearchResults`, 0)).toHaveText("Acme - Task #5");

    // Go back
    await device.pressBack();

    // Search by task title
    await typeTextQuick('searchTextInput', 'Task #1\n');
    await waitToBeVisible('dispatchTasksSearchResults');

    // Verify tasks were found on different task lists
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 0)).toHaveText("Acme - Task #11");
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 1)).toHaveText("Acme - Task #10");
    await expect(getTaskTitleElement(`${USER_JANE}TasksListSearchResults`, 0)).toHaveText("Acme - Task #1");

    // Go back
    await device.pressBack();

    // Search by task address
    await typeTextQuick('searchTextInput', 'rue Milton\n');
    await waitToBeVisible('dispatchTasksSearchResults');

    // Verify tasks were found on different task lists
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 0)).toHaveText("Acme - Task #11");
    await expect(getTaskTitleElement(`${USER_JANE}TasksListSearchResults`, 0)).toHaveText("Acme - Task #3");

    // Go back
    await device.pressBack();

    // Search by task address name
    await typeTextQuick('searchTextInput', 'Maradona\n');
    await waitToBeVisible('dispatchTasksSearchResults');

    // Verify task #10 was found on unassigled task list
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 0)).toHaveText("Acme - Task #10");

    // Go back
    await device.pressBack();

    // Search by task address contactName
    await typeTextQuick('searchTextInput', 'Marley\n');
    await waitToBeVisible('dispatchTasksSearchResults');

    // Verify tasks were found on different task lists
    await expect(getTaskTitleElement(UNASSIGNED_TASKS_LIST_ID, 0)).toHaveText("Acme - Task #11");
    await expect(getTaskTitleElement(`${USER_JANE}TasksListSearchResults`, 0)).toHaveText("Acme - Task #3");
  });

});
