import { connectToDemo, authenticateWithCredentials } from './utils'

describe('Dispatch', () => {

  beforeEach(async () => {
    await device.reloadReactNative()
  })

  it('should be able to create task', async () => {

    await connectToDemo()
    await authenticateWithCredentials('admin', 'admin')

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

  })
})
