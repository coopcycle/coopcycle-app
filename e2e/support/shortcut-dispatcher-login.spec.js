import {
  authenticateWithCredentials,
  connectToLocalDevInstance,
} from "./commands";


//FIXME: Run these tests for iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
it('SHORTCUT:DISPATCHER:LOGIN - Connect to local instance with the dispatcher user', async () => {
  await connectToLocalDevInstance();
  await authenticateWithCredentials('dispatcher', 'dispatcher');
});
