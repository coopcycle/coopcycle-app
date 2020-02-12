import BleManager from 'react-native-ble-manager'
import { NativeModules, NativeEventEmitter } from 'react-native'
import { bluetoothEnabled, bluetoothDisabled, bluetoothStopScan, printerConnected } from '../../Restaurant/actions'

const BleManagerModule = NativeModules.BleManager
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule)

export default ({ dispatch }) => {

  BleManager.start({ showAlert: false })

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

  // Check state on startup
  BleManager.checkState()

  BleManager
    .getConnectedPeripherals(['e7810a71-73ae-499d-8c15-faa9aef0c3f2'])
    .then((devices) => {
      console.log('Connected devices', devices);
      devices.forEach(device => dispatch(printerConnected(device.id)))
    })

  return (next) => (action) => next(action)
}
