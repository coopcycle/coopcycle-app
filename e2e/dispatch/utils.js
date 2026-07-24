import {
  authenticateWithCredentials,
  loadFixturesAndConnect,
  swipeLeft,
  swipeRight,
  tapById,
} from "../support/commands";
import { UNASSIGNED_TASKS_LIST_ID } from '../../src/shared/src/constants';


export async function loadDispatchFixture() {
  await loadFixturesAndConnect('dispatch_dashboard.yml', true);
}

export async function loginDispatcherUser() {
  await authenticateWithCredentials('dispatcher', 'dispatcher');
}

export async function assignTaskToUser(username, index = 0) {
  await swipeLeftTask(UNASSIGNED_TASKS_LIST_ID, index);
  await tapById(`${UNASSIGNED_TASKS_LIST_ID}:task:${index}:right`);
  await tapById(`assignTo:${username}`);
}

export async function assignOrderToUser(username, index = 0) {
  await swipeRightTask(UNASSIGNED_TASKS_LIST_ID, index);
  await tapById(`${UNASSIGNED_TASKS_LIST_ID}:task:${index}:left`);
  await tapById(`assignTo:${username}`);
}

export async function unassignTaskFromUser(username, index = 0) {
  await swipeLeftTask(`${username}TasksList`, index);
  await tapById(`${username}TasksList:task:${index}:right`);
  await tapById('unassignTask');
}

export async function unassignOrderFromUser(username, index = 0) {
  await swipeRightTask(`${username}TasksList`, index);
  await tapById(`${username}TasksList:task:${index}:left`);
  await tapById('unassignTask');
}

export async function bulkAssignToUser(username) {
  await tapById('bulkAssignButton');
  await tapById(`assignTo:${username}`);
}

export async function bulkUnassign() {
  await tapById('bulkAssignButton');
  await tapById('unassignTask');
}

export async function toggleSection(sectionId) {
  // FlashList renders a stuck section header as an overlay copy of the list
  // item, running the same renderItem — so while a header is sticky its
  // toggler testID matches two identical views (see GroupedTasks
  // stickyHeaderIndices). Both are the real header and either one toggles the
  // same section, so target the first.
  await tapById(`${sectionId}:toggler`, 0, 0);
}

export async function toggleSectionUnassigned() {
  await toggleSection(UNASSIGNED_TASKS_LIST_ID);
}

export async function toggleSectionUser(username) {
  await toggleSection(`${username}TasksList`);
}

export async function swipeLeftTask(sectionId, index = 0) {
  await swipeLeft(`${sectionId}:task:${index}`);
}

export async function swipeRightTask(sectionId, index = 0) {
  await swipeRight(`${sectionId}:task:${index}`);
}

export function expectTaskTitleToHaveText(sectionId, index, text) {
  const elemId = `${sectionId}:task:${index}:title`;
  // The title text is "<orgName> (#<id>)", uppercased via textTransform.
  // Callers pass the original-case string, e.g. "Acme (#1)". See TaskInfo.
  return expect(element(by.id(elemId))).toHaveText(text.toUpperCase());
}
