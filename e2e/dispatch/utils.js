import {
  authenticateWithCredentials,
  connectToLocalInstance,
  connectToSandbox,
  symfonyConsole
} from "../support/commands";
import {
  swipeRight,
  tapById,
} from "../utils";


export async function loadDispatchFixture() {
  if (device.getPlatform() === 'android') {
    symfonyConsole(
      'coopcycle:fixtures:load -f cypress/fixtures/dispatch.yml',
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
  await swipeRight('task:0');
  await tapById('task:0:assign');
  await tapById(`assignTo:${username}`);
}
