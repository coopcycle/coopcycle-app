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
  await tapById(`${sectionId}:toggler`);
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

export function getTaskTitleElement(sectionId, index = 0) {
  return element(by.id(`${sectionId}:task:${index}:title`))
}
