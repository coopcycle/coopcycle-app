import React, { Component } from 'react'
import {
  ActivityIndicator,
  FlatList,
  NativeEventEmitter,
  NativeModules,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { Center, Icon, Text } from 'native-base'
import { withTranslation } from 'react-i18next'
import _ from 'lodash'
import { connect } from 'react-redux'
import BleManager from 'react-native-ble-manager'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import { bluetoothStartScan, connectPrinter, disconnectPrinter } from '../../redux/Restaurant/actions'
import ItemSeparator from '../../components/ItemSeparator'
import { getMissingAndroidPermissions } from '../../utils/bluetooth'

const BleManagerModule = NativeModules.BleManager
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule)

class Printer extends Component {

  constructor(props) {
    super(props)

    this.state = {
      devices: [],
    }
  }

  componentDidMount() {
    this.discoverPeripheral = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', (device) => {

      const devices = this.state.devices.slice(0)
      devices.push(device)

      this.setState({ devices: _.uniqBy(devices, 'id') })
    })
  }

  componentWillUnmount() {
    this.discoverPeripheral.remove()
  }

  _connect(device) {
    this.props.connectPrinter(device, () => this.props.navigation.navigate('RestaurantSettings'))
  }

  _disconnect(device) {
    this.props.disconnectPrinter(device, () => this.props.navigation.navigate('RestaurantSettings'))
  }

  async _onPressScan() {

    if (this.props.isScanning) {
      return
    }

    if (Platform.OS === 'android') {

      const missingPermissions = await getMissingAndroidPermissions()

      if (missingPermissions.length > 0) {
        const granted = await PermissionsAndroid.requestMultiple(missingPermissions)
        const allPermissionsGranted = _.values(granted).every(value => value === PermissionsAndroid.RESULTS.GRANTED)
        if (allPermissionsGranted) {
          this.props.bluetoothStartScan()
        }
      } else {
        this.props.bluetoothStartScan()
      }

    } else {
      this.props.bluetoothStartScan()
    }
  }

  renderItem(item) {

    return (
      <TouchableOpacity style={ styles.item } onPress={ () => item.isConnected ? this._disconnect(item) : this._connect(item) }>
        <Text>
          { item.name || (item.advertising && item.advertising.localName) || item.id }
        </Text>
        <Icon as={ FontAwesome } name={ item.isConnected ? 'close' : 'chevron-right' } />
      </TouchableOpacity>
    )
  }

  render() {

    const { devices } = this.state
    const { isScanning, printer } = this.props

    let items = []
    if (printer) {
      items.push({ ...printer, isConnected: true })
    } else {
      items = devices.map(device => ({ ...device, isConnected: false }))
    }

    const hasItems = !isScanning && items.length > 0

    if (!hasItems) {

      return (
        <Center flex={ 1 }>
          <TouchableOpacity onPress={ () => this._onPressScan() } style={{ padding: 15, alignItems: 'center' }}>
            <Icon as={ FontAwesome } name="print" size="lg" />
            <Text>{ this.props.t('SCAN_FOR_PRINTERS') }</Text>
            { isScanning && <ActivityIndicator size="large" color="#c7c7c7" style={{ marginTop: 5 }} /> }
          </TouchableOpacity>
        </Center>
      )
    }

    return (
      <FlatList
        data={ items }
        keyExtractor={ item => item.id }
        renderItem={ ({ item }) => this.renderItem(item) }
        ItemSeparatorComponent={ ItemSeparator } />
    )
  }
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderBottomColor: '#f7f7f7',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})

function mapStateToProps(state) {

  return {
    isScanning: state.restaurant.isScanningBluetooth,
    printer: state.restaurant.printer,
  }
}

function mapDispatchToProps(dispatch) {

  return {
    connectPrinter: (device, cb) => dispatch(connectPrinter(device, cb)),
    disconnectPrinter: (device, cb) => dispatch(disconnectPrinter(device, cb)),
    bluetoothStartScan: () => dispatch(bluetoothStartScan()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Printer))
