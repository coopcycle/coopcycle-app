import BleManager from 'react-native-ble-manager'
import { NativeEventEmitter, NativeModules, Platform } from 'react-native'
import SunmiPrinter from '@heasy/react-native-sunmi-printer'
import { bluetoothDisabled, bluetoothEnabled, bluetoothStopScan, printerConnected, sunmiPrinterDetected, bluetoothStarted } from '../../Restaurant/actions'
import { canStartBluetooth } from '../../../utils/bluetooth'

const BleManagerModule = NativeModules.BleManager
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule)

export default ({ dispatch }) => {

  const didUpdateState = bleManagerEmitter.addListener('BleManagerDidUpdateState', ({ state }) => {
    if (state === 'on') {
      dispatch(bluetoothEnabled())
    } else {
      dispatch(bluetoothDisabled())
    }
  })

  const connectPeripheral = bleManagerEmitter.addListener('BleManagerConnectPeripheral', (peripheral) => {
    // TODO Dispatch action
  })

  const stopScan = bleManagerEmitter.addListener('BleManagerStopScan', ({ state }) => {
    dispatch(bluetoothStopScan())
  })

  canStartBluetooth().then(canStart => {

    if (!canStart) {
      return
    }

    BleManager.start({ showAlert: false })
      .then(() => {

        dispatch(bluetoothStarted())

        // Check state on startup
        BleManager.checkState()

        BleManager
          .getConnectedPeripherals([])
          // Even if the method is named "getConnectedPeripherals",
          // the peripherals are actually not connected (?)
          // We need to reconnect them anyways
          .then(devices =>
            devices.forEach(device =>
              BleManager.connect(device.id)
                .then(() => dispatch(printerConnected(device)))
            )
          )

      })
  })

  if (Platform.OS === 'android') {
    SunmiPrinter.hasPrinter()
      .then(hasPrinter => {
        if (hasPrinter) {
          dispatch(sunmiPrinterDetected())
        }
      })
  }

  return (next) => (action) => next(action)
}
