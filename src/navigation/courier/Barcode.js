import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Button, IconButton } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BarcodeCameraView from '../../components/BarcodeCameraView';

function TextSection({ title, value }) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.data}>{value ?? '-'}</Text>
    </View>
  );
}

function BarcodePage() {
  const [barcode, setBarcode] = useState(null);

  return (
    <View style={{ flex: 1 }}>
      <BarcodeCameraView onScanned={setBarcode} />
      <ScrollView style={{ padding: 20 }}>
        <TextSection
          title="Address"
          value={barcode ? '6 rue Léon Blum' : null}
        />
        <TextSection
          title="Recipient"
          value={barcode ? 'Jean-Luc Picard' : null}
        />
        <TextSection
          title="Weight / Volume"
          value={barcode ? '1.5 kg' : null}
        />
        <TextSection title="Phone" value={barcode ? '0612345678' : null} />
        <TextSection title="Code" value={barcode} />
        <Button variant="link">Add note</Button>
      </ScrollView>
      <View
        style={{
          padding: 15,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <IconButton
          _icon={{ as: Ionicons, name: 'call', color: 'green.500' }}
        />
        <Button width="70%" colorScheme={'dark'}>
          Finished
        </Button>
        <IconButton
          _icon={{
            as: Ionicons,
            name: 'warning',
            color: 'red.500',
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  data: {
    fontWeight: '600',
    color: 'black',
    fontSize: 16,
  },
  section: { paddingVertical: 8 },
  title: { fontSize: 16, paddingBottom: 3 },
});

function mapStateToProps(state) {
  return {
    ...state,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(BarcodePage));
