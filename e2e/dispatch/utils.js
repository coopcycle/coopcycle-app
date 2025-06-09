import {
  authenticateWithCredentials,
  connectToLocalInstance,
  connectToSandbox,
  launchApp,
  symfonyConsole
} from "../support/commands";
import {
  swipeLeft,
  swipeRight,
  tapById,
} from "../utils";
import { UNASSIGNED_TASKS_LIST_ID } from '../../src/shared/src/constants';


export async function loadDispatchFixture() {
  if (device.getPlatform() === 'android') {
    symfonyConsole(
      'coopcycle:fixtures:load -s cypress/fixtures/setup_default.yml -f cypress/fixtures/dispatch.yml',
    );
    await connectToLocalInstance();
  } else {
    //FIXME: run against local instance on iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
    await connectToSandbox();
  }
}

export async function relaunchCleanApp() {
  await launchApp();
}

export async function doLoginForUserWithRoleDispatcher() {
  await authenticateWithCredentials('dispatcher', 'dispatcher');
}

export async function assignTaskToUser(username, index = 0) {
  // Select first task in Dispatch's view and try to assign it to user with username
  await swipeLeftTask(UNASSIGNED_TASKS_LIST_ID, index);
  await tapById(`${UNASSIGNED_TASKS_LIST_ID}:task:${index}:right`);
  await tapById(`assignTo:${username}`);
}

export async function unassignTaskFromUser(username, index = 0) {
  // Select first assigned task to user with username and try to unassign it
  await swipeLeftTask(`${username}TasksList`, index);
  await tapById(`${username}TasksList:task:${index}:right`);
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

export async function swipeLeftTask(sectionId, index = 0) {
  await swipeLeft(`${sectionId}:task:${index}`);
}

export async function swipeRightTask(sectionId, index = 0) {
  await swipeRight(`${sectionId}:task:${index}`);
}

export function getTaskTitleElement(sectionId, index = 0) {
  return element(by.id(`${sectionId}:task:${index}:title`))
}
