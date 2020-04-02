import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  NativeModules,
  NativeEventEmitter,
  ActivityIndicator,
  Platform,
  PermissionsAndroid
} from 'react-native'
import { Container, Icon, Text } from 'native-base'
import { withTranslation } from 'react-i18next'
import _ from 'lodash'
import { connect } from 'react-redux'
import BleManager from 'react-native-ble-manager'

import { connectPrinter, bluetoothStartScan, disconnectPrinter } from '../../redux/Restaurant/actions'

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

      if (!device.advertising.isConnectable) {
        return
      }

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

    // Make sure we have "ACCESS_COARSE_LOCATION" permission or scan won't work
    if (Platform.OS === 'android' && Platform.Version >= 23) {

      const isGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION)
      if (!isGranted) {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION)
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          await BleManager.scan([], 30, true)
          this.props.bluetoothStartScan()
        }
      } else {
        await BleManager.scan([], 30, true)
        this.props.bluetoothStartScan()
      }

    } else {
      await BleManager.scan([], 30, true)
      this.props.bluetoothStartScan()
    }
  }

  renderItem(item) {

    return (
      <TouchableOpacity style={ styles.item } onPress={ () => item.isConnected ? this._disconnect(item) : this._connect(item) }>
        <Text>
          { item.name || item.id }
        </Text>
        <Icon type="FontAwesome" name={ item.isConnected ? 'close' : 'chevron-right' } />
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

    console.log(items)

    const showList = !isScanning && items.length > 0

    const contentStyle = []
    if (!showList) {
      contentStyle.push(styles.content)
    }

    return (
      <Container>
        <View style={ contentStyle }>
          { showList && (
            <FlatList
              data={ items }
              keyExtractor={ item => item.id }
              renderItem={ ({ item }) => this.renderItem(item) } />
          ) }
          { !showList && (
            <TouchableOpacity onPress={ () => this._onPressScan() } style={{ padding: 15, alignItems: 'center' }}>
              <Icon type="FontAwesome" name="print" style={{ fontSize: 42 }} />
              <Text>{ this.props.t('SCAN_FOR_PRINTERS') }</Text>
              { isScanning && <ActivityIndicator size="large" color="#c7c7c7" style={{ marginTop: 5 }} /> }
            </TouchableOpacity>
          ) }
        </View>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
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

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Printer))
