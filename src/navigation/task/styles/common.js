// Source file for common logic related to how task is presented to a user (UI)

import {darkGreyColor, redColor, whiteColor} from '../../../styles/common'

const doneIconName = 'check'
const failedIconName = 'remove'

const pickupIconName = 'cube'
const dropOffIconName = 'arrow-down'

const taskTypeIconName = task => task.type === 'PICKUP' ? pickupIconName : dropOffIconName


const markerContainerSize = 32

const markerColor = task => {
  let color = darkGreyColor

  if (task.tags.length > 0) {
    color = task.tags[0].color
  }

  switch (task.status) {
  case 'DONE':
    return color
  case 'FAILED':
    return redColor
  default:
    return color
  }
}

const markerOpacity = task => {
  switch (task.status) {
  case 'DONE':
    return 0.4
  case 'FAILED':
    return 0.4
  default:
    return 1
  }
}

const markerContainer = {
  margin: 10,
  alignItems: 'center',
  justifyContent: 'center',
}

const markerBackgroundStyle = task => {
  return {
    width: markerContainerSize,
    height: markerContainerSize,
    backgroundColor: whiteColor,
    borderColor: markerColor(task),
    opacity: markerOpacity(task),
    borderWidth: 2,
    borderStyle: 'solid',
    borderTopLeftRadius: markerContainerSize / 2,
    borderTopRightRadius: markerContainerSize / 2,
    borderBottomLeftRadius: markerContainerSize / 2,
    borderBottomRightRadius: 0,
    transform: [
      {rotate: '45deg'},
    ],
  }
}

const markerIconStyle = task => {
  return {
    position: 'absolute',
    fontSize: 18,
    color: markerColor(task),
    opacity: markerOpacity(task),
  }
}

export {
  doneIconName,
  failedIconName,
  pickupIconName,
  dropOffIconName,
  taskTypeIconName,
  markerContainer,
  markerBackgroundStyle,
  markerIconStyle,
}
