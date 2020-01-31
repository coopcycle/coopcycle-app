import { connectToDemo, authenticateWithCredentials } from './utils'

const exec = require('child-process-promise').exec;

describe('Messenger', () => {

  beforeEach(async () => {
    await device.reloadReactNative()

    // https://github.com/wix/Detox/issues/1371
    // await device.setLocation(48.856613, 2.352222);
    const { stdout, stderr } = await exec("idb list-targets | grep -n 'Booted'");
    await exec(`idb set-location --udid ${device._deviceId} 48.856613 2.352222`);
  })

  it('should be able to complete task', async () => {

    await connectToDemo()
    await authenticateWithCredentials('bot_1', 'bot_1')

    await device.takeScreenshot(`Messenger-Map`);

    await element(by.id('messengerTabList')).tap()

    await device.takeScreenshot(`Messenger-List`);

    await waitFor(element(by.id('task:0'))).toExist().withTimeout(5000)
    await expect(element(by.id('task:0'))).toBeVisible()
    await element(by.id('task:0')).tap()

    await device.takeScreenshot(`Messenger-Task`);

    await element(by.id('task:completeButton')).swipe('right', 'fast', 0.5)
    // We can't watch for the button to be visible, because it's behind
    await element(by.id('task:completeSuccessButton')).tap()

    await device.takeScreenshot(`Messenger-TaskComplete`);
  })
})
