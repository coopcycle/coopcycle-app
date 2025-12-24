import { swipeLeft, swipeRight, tapById } from '../support/commands';

export async function tapTask(index = 0) {
  await tapById(`courierTaskList:task:${index}`);
}

export async function swipeLeftTask(index = 0) {
  await swipeLeft(`courierTaskList:task:${index}`);
}

export async function swipeLeftTaskAndTap(index = 0) {
  await swipeLeft(`courierTaskList:task:${index}`);
  await tapById(`courierTaskList:task:${index}:right`);
}

export async function swipeRightTask(index = 0) {
  await swipeRight(`courierTaskList:task:${index}`);
}

export async function swipeRightTaskAndTap(index = 0) {
  await swipeRight(`courierTaskList:task:${index}`);
  await tapById(`courierTaskList:task:${index}:left`);
}
