import { element } from "prop-types";
import { assignTaskToUser, doLoginForUserWithRoleDispatcher, loadDispatchFixture } from "./utils";
import { itif } from "../utils";

const USERNAME = 'jane';

describe('Dispatch - Assing and unassign tasks', () => {
    beforeEach(async () => {
        await device.reloadReactNative();
        await loadDispatchFixture()
        await doLoginForUserWithRoleDispatcher();
    });

    itif(device.getPlatform() === 'android')(
        'should assing a single task to a courier',
        async () => {
            // TODO check - this refers to the list, not tasks
            await expect(element(by.id('unassignedTasksList'))).toBeVisible();
            await expect(element(by.id('task:0'))).toBeVisible();
            await assignTaskToUser(USERNAME)

            // Verify task is on Jane's task list
                // Jane has a taskList
            await expect(element(by.text('jane'))).toBeVisible()
                // TODO: how to check this only on Jane's task list
            await expect(element(by.id('task:0'))).toBeVisible();
                }
    )
})