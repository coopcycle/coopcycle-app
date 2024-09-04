import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Vibration,
  Alert,
} from 'react-native';
import { Button, IconButton, TextArea } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BarcodeCameraView from '../../../components/BarcodeCameraView';

import { CommonActions } from '@react-navigation/native';
import NavigationHolder from '../../../NavigationHolder';
import { assignTask } from '../../../redux/Dispatch/actions';
import { unassignTask } from '../../../redux/Dispatch/actions';
import Modal from "react-native-modal"

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

function BarcodePage({ httpClient, user, assignTask, unassignTask }) {
  const [barcode, setBarcode] = useState(null);
  const [entity, setEntity] = useState(null);
  const [clientAction, setClientAction] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);

  const askUnassign = () => {
    Alert.alert(
      'Task already assigned',
      'This task is already assigned to you',
      [
        {
          text: 'Unassign',
          onPress: () => {
            unassignTask(entity.id, user.username);
            setClientAction(null);
          },
        },
        {
          text: 'Ok',
          onPress: () => {
            setClientAction(null);
          },
        },
      ],
    );
  };

  const askAssign = () => {
    Alert.alert(
      'Task already assigned',
      'This task is already assigned to another courier',
      [
        {
          text: 'Assign to me',
          onPress: () => {
            assignTask(entity.id, user.username);
            setClientAction(null);
          },
        },
        {
          text: 'Ok',
          onPress: () => {
            setClientAction(null);
          },
        },
      ],
    );
  };

  useEffect(() => {
    return;
    if (!clientAction) return;
    switch (clientAction) {
      case 'ask_unassign':
        askUnassign();
        break;
      case 'ask_assign':
        askAssign();
        break;
      default:
        setClientAction(null);
    }
  }, [clientAction]);

  useEffect(() => {
    if (!entity) return;
    if (!entity?.barcodes?.packages) return;
    const packages = entity?.barcodes?.packages.reduce(
      (acc, p) => acc + p.barcodes.length,
      0,
    );
    if (packages > 1) {
      const details = entity?.barcodes?.packages
        .map(p => `${p.barcodes.length}x ${p.name}`)
        .join('\n');
      Alert.alert(
        'Multiple packages',
        `${packages} packages:\n\n${details}\n\nNo need to scan the other packages`,
        [{ text: 'Ok' }],
      );
    }
  }, [entity]);

  return <>
      <Modal isVisible={showNoteModal} onDismiss={() => setShowNoteModal(false)}>
      <View style={{ flex: 1, backgroundColor: 'white', padding: 20, borderRadius: 5 }}>
          <TextArea />
          <Button onPress={() => setShowNoteModal(false)}>Save</Button>
          </View>
      </Modal>
    <View style={{ flex: 1 }}>
      <BarcodeCameraView
        onScanned={async code => {
          if (clientAction) return;
          const { entity, client_action } = await _fetchBarcode(
            httpClient,
            code,
          );
          setBarcode(code);
          setEntity(entity);
          setClientAction(client_action);
        }}
      />
      <ScrollView style={{ paddingHorizontal: 20, marginVertical: 20 }}>
        <TextSection title="Address" value={entity?.address?.streetAddress} />
        <TextSection title="Recipient" value={entity?.address?.contactName} />
        <TextSection title="Weight / Volume" value={entity?.weight} />
        <TextSection title="Phone" value={entity?.address?.telephone} />
        <TextSection title="Code" value={barcode} />
        <TextSection title="Comment" value={entity?.comments} variant="note" />
        <Button onPress={() => setShowNoteModal(true)}>Add note</Button>
      </ScrollView>
      <View
        style={{
          padding: 15,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <IconButton
          _icon={{ as: Ionicons, name: 'call', color: 'green.500' }}
          disabled={entity === null}
        />
        <Button width="70%" colorScheme={'dark'}>
          Finished
        </Button>
        <IconButton
          onPress={() =>
            NavigationHolder.dispatch(
              CommonActions.navigate('CourierBarcodeReport', { entity }),
            )
          }
          disabled={entity === null}
          _icon={{
            as: Ionicons,
            name: 'warning',
            color: 'red.500',
          }}
        />
      </View>
    </View>
  </>;
}

const styles = StyleSheet.create({
  data: {
    fontWeight: '600',
    color: 'black',
    fontSize: 16,
  },
  note: {
    color: 'black',
    fontSize: 14,
  },
  section: { paddingVertical: 8 },
  title: { fontSize: 16, paddingBottom: 3 },
});

function mapStateToProps(state) {
  return {
    httpClient: state.app.httpClient,
    user: state.app.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    assignTask: (task_id, username) =>
      dispatch(assignTask({ '@id': task_id }, username)),
    unassignTask: (task_id, username) =>
      dispatch(unassignTask({ '@id': task_id }, username)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(BarcodePage));
