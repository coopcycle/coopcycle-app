import {
  authenticateWithCredentials,
  connectToLocalInstance,
  connectToSandbox,
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

export async function doLoginForUserWithRoleDispatcher() {
  await authenticateWithCredentials('dispatcher', 'dispatcher');
}

export async function assignTaskToUser(username) {
  // Select first task in Dispatch's view and try to assign it to user with username
  await swipeLeft(`${UNASSIGNED_TASKS_LIST_ID}:task:0`);
  await tapById(`${UNASSIGNED_TASKS_LIST_ID}:task:0:right`);
  await tapById(`assignTo:${username}`);
}

export async function bulkAssignTaskToUser(username) {
  // Select 2 tasks in Dispatch's view and try to assign it to user with username
  await swipeLeft(`${UNASSIGNED_TASKS_LIST_ID}:task:0`);
  await swipeLeft(`${UNASSIGNED_TASKS_LIST_ID}:task:1`);
  await tapById('bulkAssignButton');
  await tapById(`assignTo:${username}`);
}

export async function unassignTaskFromUser(username) {
  // Select first assigned task to user with username and try to unassign it
  await swipeLeft(`${username}TasksList:task:0`);
  await tapById(`${username}TasksList:task:0:right`);
  await tapById('unassignTask');
}

export async function toggleSection(sectionId) {
  await tapById(`${sectionId}:toggler`);
}
