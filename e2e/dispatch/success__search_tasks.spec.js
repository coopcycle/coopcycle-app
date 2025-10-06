import { UNASSIGNED_TASKS_LIST_ID } from "../../src/shared/src/constants";
import {
  describeif,
  typeTextQuick,
  waitToBeVisible,
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
  ('Dispatch - Search for tasks', () => {

  beforeEach(async () => {
    await loadDispatchFixture();
    await loginDispatcherUser();
  });

  it('should correctly find tasks on different tasklists', async () => {
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

    // Search by username
    await typeTextQuick('searchTextInput', `${USER_JANE}\n`);
    await waitToBeVisible('dispatchTasksSearchResults');

    // Show USER_JANE's tasks section on search results
    await toggleSectionUser(USER_JANE);
    // Verify tasks #1+#2+#3 were found on USER_JANE's task list
    await expectTaskTitleToHaveText(`${USER_JANE}TasksListSearchResults`, 0, "Acme (task #1)");
    await expectTaskTitleToHaveText(`${USER_JANE}TasksListSearchResults`, 1, "Acme (task #2)");
    await expectTaskTitleToHaveText(`${USER_JANE}TasksListSearchResults`, 2, "Acme (task #3)");

    // Go back
    await device.pressBack();

    // Search by task orgName
    await typeTextQuick('searchTextInput', 'Acme\n');
    await waitToBeVisible('dispatchTasksSearchResults');

    // Show unassigned tasks section on search results
    await toggleSectionUnassigned();
    // Verify tasks were found on different task lists
    await expectTaskTitleToHaveText(UNASSIGNED_TASKS_LIST_ID, 0, "Acme (task #7)");
    // Hide unassigned and show USER_JANE's tasks section on search results
    await toggleSectionUnassigned();
    await toggleSectionUser(USER_JANE);
    await expectTaskTitleToHaveText(`${USER_JANE}TasksListSearchResults`, 0, "Acme (task #1)");
    // Hide USER_JANE's and show USER_ZAK's tasks section on search results
    await toggleSectionUser(USER_JANE);
    await toggleSectionUser(USER_ZAK);
    await expectTaskTitleToHaveText(`${USER_ZAK}TasksListSearchResults`, 0, "Acme (task #5)");

    // Go back
    await device.pressBack();

    // Search by task title
    await typeTextQuick('searchTextInput', '#1\n');
    await waitToBeVisible('dispatchTasksSearchResults');

    // Show unassigned and USER_JANE's tasks section on search results
    await toggleSectionUnassigned();
    await toggleSectionUser(USER_JANE);
    // Verify tasks were found on different task lists
    await expectTaskTitleToHaveText(UNASSIGNED_TASKS_LIST_ID, 0, "Acme (task #11)");
    await expectTaskTitleToHaveText(UNASSIGNED_TASKS_LIST_ID, 1, "Acme (task #10)");
    await expectTaskTitleToHaveText(`${USER_JANE}TasksListSearchResults`, 0, "Acme (task #1)");

    // Go back
    await device.pressBack();

    // Search by task address
    await typeTextQuick('searchTextInput', 'rue Milton\n');
    await waitToBeVisible('dispatchTasksSearchResults');

    // Show unassigned and USER_JANE's tasks section on search results
    await toggleSectionUnassigned();
    await toggleSectionUser(USER_JANE);
    // Verify tasks were found on different task lists
    await expectTaskTitleToHaveText(UNASSIGNED_TASKS_LIST_ID, 0, "Acme (task #11)");
    await expectTaskTitleToHaveText(`${USER_JANE}TasksListSearchResults`, 0, "Acme (task #3)");

    // Go back
    await device.pressBack();

    // Search by task address name
    await typeTextQuick('searchTextInput', 'Maradona\n');
    await waitToBeVisible('dispatchTasksSearchResults');

    // Show unassigned tasks section on search results
    //await toggleSectionUnassigned(); (THIS IS A BUG: it should be hidden by default but it's visible)
    // Verify task #10 was found on unassigled task list
    await expectTaskTitleToHaveText(UNASSIGNED_TASKS_LIST_ID, 0, "Acme (task #10)");

    // Go back
    await device.pressBack();

    // Search by task address contactName
    await typeTextQuick('searchTextInput', 'Marley\n');
    await waitToBeVisible('dispatchTasksSearchResults');

    // Show unassigned and USER_JANE's tasks section on search results
    await toggleSectionUnassigned();
    await toggleSectionUser(USER_JANE);
    // Verify tasks were found on different task lists
    await expectTaskTitleToHaveText(UNASSIGNED_TASKS_LIST_ID, 0, "Acme (task #11)");
    await expectTaskTitleToHaveText(`${USER_JANE}TasksListSearchResults`, 0, "Acme (task #3)");
  });

});
