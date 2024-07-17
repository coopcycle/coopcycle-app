import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet, Text, View, Vibration } from 'react-native';
import { Button, IconButton } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BarcodeCameraView from '../../components/BarcodeCameraView';

async function _fetchBarcode(httpClient, barcode) {
  if (barcode) {
    return await httpClient.get(`/api/barcode?code=${barcode}`);
  }
  return {
    ressource: null,
    entity: null,
  };
}

function TextSection({ title, value, variant = 'data' }) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles[variant]}>{value ?? '-'}</Text>
    </View>
  );
}

function BarcodePage({ httpClient }) {
  const [barcode, setBarcode] = useState(null);
  const [entity, setEntity] = useState(null);

  return (
    <View style={{ flex: 1 }}>
      <BarcodeCameraView onScanned={async (code) => {
        const { entity } = await _fetchBarcode(httpClient, code);
        setBarcode(code);
        setEntity(entity);
      }} />
      <ScrollView style={{ paddingHorizontal: 20, marginVertical: 20 }}>
        <TextSection title="Address" value={entity?.address?.streetAddress} />
        <TextSection title="Recipient" value={entity?.address?.name} />
        <TextSection title="Weight / Volume" value={entity?.weight} />
        <TextSection title="Phone" value={entity?.address?.telephone} />
        <TextSection title="Code" value={barcode} />
        <TextSection title="Comment" value={entity?.comments} variant='note' />
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
  note: {
    color: 'black',
    fontSize: 14
  },
  section: { paddingVertical: 8 },
  title: { fontSize: 16, paddingBottom: 3 },
});

function mapStateToProps(state) {
  return {
    httpClient: state.app.httpClient,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(BarcodePage));
