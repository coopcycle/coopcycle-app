import { connectToDemo, authenticateWithCredentials, logout } from './utils'
const exec = require('child-process-promise').exec

describe('Dispatch', () => {

  beforeEach(async () => {
    await device.reloadReactNative()

    // https://github.com/wix/Detox/issues/1371
    if (device.getPlatform() === 'ios') {
      const { stdout, stderr } = await exec("idb list-targets | grep -n 'Booted'");
      await exec(`idb set-location --udid ${device._deviceId} 48.856613 2.352222`);
    } else {
      await device.setLocation(48.856613, 2.352222);
    }
  })

  it('should be able to create task', async () => {

    await connectToDemo()
    await authenticateWithCredentials('admin', 'admin')

    await expect(element(by.id('menuBtn'))).toBeVisible()
    await element(by.id('menuBtn')).tap()
    await element(by.label('Dispatch')).tap()

    await expect(element(by.id('addTask'))).toBeVisible()
    await element(by.id('addTask')).tap()

    await waitFor(element(by.id('taskFormTypeahead'))).toExist().withTimeout(5000)
    await element(by.id('taskFormTypeahead')).typeText('23 av claude vellefaux')
    await waitFor(element(by.id('placeId:ChIJPSRadeBt5kcR4B2HzbBfZQE'))).toBeVisible().withTimeout(10000)
    await element(by.id('placeId:ChIJPSRadeBt5kcR4B2HzbBfZQE')).tap()
    await element(by.id('submitTaskForm')).tap()

    await waitFor(element(by.id('task:0'))).toExist().withTimeout(5000)
    await element(by.id('task:0')).swipe('right', 'fast', 0.5)

    await element(by.id('task:0:assign')).tap()
    await element(by.id('assignTo:bot_1')).tap()

    await element(by.id('dispatch:assignedTab')).tap()
    await element(by.id('dispatch:taskLists:bot_1')).tap()

    await element(by.id('header-back')).tap()

    // await element(by.id('dispatch:unassignedTab')).tap()

    await element(by.id('menuBtnDispatch')).tap()

    await logout()

    await element(by.id('loginUsername')).typeText('bot_1')
    await element(by.id('loginPassword')).typeText('bot_1')

    try {
      await element(by.id('loginSubmit')).tap()
    } catch (e) {}

    await element(by.id('messengerTabList')).tap()

    await waitFor(element(by.id('task:0'))).toExist().withTimeout(5000)
    await expect(element(by.id('task:0'))).toBeVisible()
    await element(by.id('task:0')).tap()

    await element(by.id('task:completeButton')).swipe('right', 'fast', 0.5)
    // We can't watch for the button to be visible, because it's behind
    await element(by.id('task:completeSuccessButton')).tap()

  })

})
