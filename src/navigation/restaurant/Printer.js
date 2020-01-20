import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity, FlatList, NativeModules, NativeEventEmitter, ActivityIndicator } from 'react-native'
import { Container, Icon, Text } from 'native-base'
import { withTranslation } from 'react-i18next'
import _ from 'lodash'
import { connect } from 'react-redux'
import BleManager from 'react-native-ble-manager'

import { connectPrinter, bluetoothStartScan } from '../../redux/Restaurant/actions'

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
      let devices = this.state.devices.slice(0)
      if (!_.find(devices, d => d.id === device.id)) {
        devices.push(device)
        this.setState({ devices })
      }
    })
  }

  componentWillUnmount() {
    this.discoverPeripheral.remove()
  }

  _connectToDevice(device) {
    this.props.connectPrinter(device)
  }

  _onPressScan() {
    if (!this.props.isScanning) {
      BleManager.scan(["e7810a71-73ae-499d-8c15-faa9aef0c3f2"], 10, true)
        .then(() => {
          this.props.bluetoothStartScan()
        })
    }
  }

  renderItem(item) {

    const { thermalPrinter } = this.props

    const isConnected = thermalPrinter && thermalPrinter.id === item.id

    return (
      <TouchableOpacity style={ styles.item } onPress={ () => this._connectToDevice(item) }>
        <Text>
          { item.name }
        </Text>
        <Icon type="FontAwesome" name={ isConnected ? 'check' : 'chevron-right' } />
      </TouchableOpacity>
    )
  }

  render() {

    const { devices } = this.state
    const { isScanning } = this.props

    const showList = !isScanning && devices.length > 0

    const contentStyle = []
    if (!showList) {
      contentStyle.push(styles.content)
    }

    return (
      <Container>
        <View style={ contentStyle }>
          { showList && (
            <FlatList
              data={ this.state.devices }
              keyExtractor={ item => item.id }
              renderItem={ ({ item }) => this.renderItem(item) } />
          ) }
          { !showList && (
            <TouchableOpacity onPress={ this._onPressScan.bind(this) } style={{ padding: 15, alignItems: 'center' }}>
              <Icon type="FontAwesome" name="print" style={{ fontSize: 42 }} />
              <Text>{ this.props.t('SCAN_FOR_PRINTERS') }</Text>
              { isScanning && <ActivityIndicator size="large" color="#c7c7c7" /> }
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
    thermalPrinter: state.restaurant.thermalPrinter,
    isScanning: state.restaurant.isScanningBluetooth,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    connectPrinter: (device) => dispatch(connectPrinter(device)),
    bluetoothStartScan: () => dispatch(bluetoothStartScan()),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Printer))
