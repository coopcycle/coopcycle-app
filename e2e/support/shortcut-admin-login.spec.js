import {
  authenticateWithCredentials,
  connectToLocalDevInstance,
} from "./commands";


//FIXME: Run these tests for iOS too (see https://github.com/coopcycle/coopcycle-ops/issues/97)
it('SHORTCUT:ADMIN:LOGIN - Connect to local instance with the admin user', async () => {
  await connectToLocalDevInstance();
  await authenticateWithCredentials('admin', 'admin');
});
