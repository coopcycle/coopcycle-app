import {
  assignTaskToUser,
  doLoginForUserWithRoleDispatcher,
  loadDispatchFixture,
} from './utils';
import { itif } from '../utils';

describe('Dispatch - Task lifecycle', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    await loadDispatchFixture();
    await doLoginForUserWithRoleDispatcher();
    await assignTaskToUser();
  });

  //FIXME: run these tests for iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
  itif(device.getPlatform() === 'android')(
    `should mark a task as started`,
    async () => {

  });
});
