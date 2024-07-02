import _ from 'lodash';
import { Center, Icon, Text, View } from 'native-base';
import React, { Component } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation, withTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  NativeEventEmitter,
  NativeModules,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import ItemSeparator from '../../components/ItemSeparator';
import {
  bluetoothStartScan,
  connectPrinter,
  disconnectPrinter,
  setPrintNumberOfCopies,
} from '../../redux/Restaurant/actions';
import {
  selectAutoAcceptOrdersEnabled,
  selectAutoAcceptOrdersPrintNumberOfCopies,
  selectPrinter,
} from '../../redux/Restaurant/selectors';
import { useBackgroundContainerColor } from '../../styles/theme';
import { getMissingAndroidPermissions } from '../../utils/bluetooth';
import Range from '../checkout/ProductDetails/Range';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

function Item({ item }) {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const _connect = device => {
    dispatch(
      connectPrinter(device, () => navigation.navigate('RestaurantSettings')),
    );
  };

  const _disconnect = device => {
    dispatch(
      disconnectPrinter(device, () =>
        navigation.navigate('RestaurantSettings'),
      ),
    );
  };

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => (item.isConnected ? _disconnect(item) : _connect(item))}>
      <Text>
        {item.name ||
          (item.advertising && item.advertising.localName) ||
          item.id}
      </Text>
      <Icon
        as={FontAwesome}
        name={item.isConnected ? 'close' : 'chevron-right'}
      />
    </TouchableOpacity>
  );
}

function PrinterComponent({ devices, isScanning, _onPressScan }) {
  const printer = useSelector(selectPrinter);
  const autoAcceptOrdersEnabled = useSelector(selectAutoAcceptOrdersEnabled);
  const printNumberOfCopies = useSelector(
    selectAutoAcceptOrdersPrintNumberOfCopies,
  );

  const backgroundColor = useBackgroundContainerColor();

  const { t } = useTranslation();

  const dispatch = useDispatch();

  let items = [];
  if (printer) {
    items.push({ ...printer, isConnected: true });
  } else {
    items = devices.map(device => ({ ...device, isConnected: false }));
  }

  const hasItems = !isScanning && items.length > 0;

  if (!hasItems) {
    return (
      <Center flex={1}>
        <TouchableOpacity
          onPress={_onPressScan}
          style={{ padding: 15, alignItems: 'center' }}>
          <Icon as={FontAwesome} name="print" size="lg" />
          <Text>{t('SCAN_FOR_PRINTERS')}</Text>
          {isScanning && (
            <ActivityIndicator
              size="large"
              color="#c7c7c7"
              style={{ marginTop: 5 }}
            />
          )}
        </TouchableOpacity>
      </Center>
    );
  }

  return (
    <View>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <Item key={item.id} item={item} />}
        ItemSeparatorComponent={ItemSeparator}
      />
      {autoAcceptOrdersEnabled ? (
        <View style={[styles.quantityWrapper, { backgroundColor }]}>
          <Text>{t('AUTO_ACCEPT_ORDERS_PRINT_NUMBER_OF_COPIES')}:</Text>
          <Range
            minimum={0}
            onPressDecrement={() =>
              dispatch(setPrintNumberOfCopies(printNumberOfCopies - 1))
            }
            quantity={printNumberOfCopies}
            onPressIncrement={() =>
              dispatch(setPrintNumberOfCopies(printNumberOfCopies + 1))
            }
          />
        </View>
      ) : null}
    </View>
  );
}

class Printer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      devices: [],
    };
  }

  componentDidMount() {
    this.discoverPeripheral = bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      device => {
        const devices = this.state.devices.slice(0);
        devices.push(device);

        this.setState({ devices: _.uniqBy(devices, 'id') });
      },
    );
  }

  componentWillUnmount() {
    this.discoverPeripheral.remove();
  }

  async _onPressScan() {
    if (this.props.isScanning) {
      return;
    }

    if (Platform.OS === 'android') {
      const missingPermissions = await getMissingAndroidPermissions();

      if (missingPermissions.length > 0) {
        const granted = await PermissionsAndroid.requestMultiple(
          missingPermissions,
        );
        const allPermissionsGranted = _.values(granted).every(
          value => value === PermissionsAndroid.RESULTS.GRANTED,
        );
        if (allPermissionsGranted) {
          this.props.bluetoothStartScan();
        }
      } else {
        this.props.bluetoothStartScan();
      }
    } else {
      this.props.bluetoothStartScan();
    }
  }

  //FIXME; fully migrate to a functional component
  render() {
    return (
      <PrinterComponent
        devices={this.state.devices}
        isScanning={this.props.isScanning}
        _onPressScan={() => this._onPressScan()}
      />
    );
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
  quantityWrapper: {
    margin: 20,
    paddingHorizontal: 4,
    paddingVertical: 20,
    flexDirection: 'row',
    gap: 16,
  },
});

function mapStateToProps(state) {
  return {
    isScanning: state.restaurant.isScanningBluetooth,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    bluetoothStartScan: () => dispatch(bluetoothStartScan()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(Printer));
