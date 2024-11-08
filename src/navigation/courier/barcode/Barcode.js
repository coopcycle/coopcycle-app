import React, { useEffect, useState, useRef } from 'react';
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
import { Button, IconButton, TextArea, FormControl, Icon } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BarcodeCameraView from '../../../components/BarcodeCameraView';

import { CommonActions } from '@react-navigation/native';
import NavigationHolder from '../../../NavigationHolder';
import { phonecall } from 'react-native-communications';
import BottomModal from '../../../components/BottomModal';
import { navigateToCompleteTask } from '../../utils';
import { selectTasks } from '../../../redux/Courier';

async function _fetchBarcode(httpClient, barcode) {
  if (barcode) {
    return await httpClient.get(`/api/barcode?code=${barcode}`);
  }
  return {
    ressource: null,
    entity: null,
  };
}

async function _putNote(httpClient, task_id, note) {
  if (note && task_id) {
    return await httpClient.put(`/api/tasks/${task_id}/append_to_comment`, {
      note,
    });
  }
}

async function _assignTask(httpClient, task_id) {
  if (task_id) {
    return await httpClient.put(`/api/tasks/${task_id}/assign`);
  }
}

async function _unassignTask(httpClient, task_id) {
  if (task_id) {
    return await httpClient.put(`/api/tasks/${task_id}/unassign`);
  }
}

function TextSection({ title, value, variant = 'data' }) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles[variant]}>{value ?? '-'}</Text>
    </View>
  );
}

function BarcodePage({
  t,
  httpClient,
  navigation,
  route,
  taskLists,
}) {
  const [barcode, setBarcode] = useState(null);
  const [entity, setEntity] = useState(null);
  const [clientAction, setClientAction] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteLoading, setNoteLoading] = useState(false);
  const [disableScan, setDisableScan] = useState(false);

  const note = useRef(null);

  const askToUnassign = () =>
    new Promise((resolve, reject) => {
      Alert.alert(
        'Task already assigned',
        'This task is already assigned to you',
        [
          {
            text: 'Unassign',
            onPress: () => {
              _unassignTask(httpClient, entity.id).then(resolve).catch(reject);
            },
          },
          {
            text: 'Ok',
            onPress: () => {
              resolve();
            },
          },
        ],
      );
    });

  const askToAssign = () =>
    new Promise((resolve, reject) => {
      Alert.alert(
        'Task already assigned',
        'This task is already assigned to another courier',
        [
          {
            text: 'Assign to me',
            onPress: () => {
              _assignTask(httpClient, entity.id).then(resolve).catch(reject);
            },
          },
          {
            text: 'Ok',
            onPress: () => {
              resolve();
            },
          },
        ],
      );
    });

  const checkMultiplePackages = packages => {
    if (!packages) return;
    const count = packages.reduce((acc, p) => acc + p.barcodes.length, 0);
    if (count > 1) {
      const details = packages
        .map(p => `${p.barcodes.length}x ${p.name}`)
        .join('\n');
      setDisableScan(true);
      Alert.alert(
        t('TASK_MULTIPLE_PACKAGES'),
        `${t('X_PACKAGES', { count })}:\n\n${details}\n\n${t('NO_NEED_TO_SCAN_OTHERS')}`,
        [{ text: t('OK'), onPress: () => setDisableScan(false) }],
      );
    }
  };

  useEffect(() => {
    async function checkClientAction() {
      if (!clientAction || !entity) return;
      switch (clientAction) {
        case 'ask_to_unassign':
          await askToUnassign();
          break;
        case 'ask_to_assign':
          await askToAssign();
          break;
        case 'ask_to_complete':
          navigateToCompleteTask(
            navigation,
            route,
            taskLists.find(t => t['@id'] === `/api/tasks/${entity.id}`),
          );
          break;
      }
      setClientAction(null);
    }
    checkClientAction();
  }, [clientAction]);

  useEffect(() => {
    if (!entity) return;
    checkMultiplePackages(entity?.barcodes?.packages);
  }, [entity]);

  return (
    <>
      <BottomModal
        isVisible={showNoteModal}
        onDismiss={() => setShowNoteModal(false)}
        onBackdropPress={() => setShowNoteModal(false)}>
        <FormControl>
          <FormControl.Label>{t('NOTES')}</FormControl.Label>
          <TextArea
            autoFocus
            onChange={e => (note.current = e.nativeEvent.text)}
          />
        </FormControl>
        <Button
          isLoading={noteLoading}
          onPress={async () => {
            setNoteLoading(true);
            await _putNote(httpClient, entity?.id, note.current);
            setShowNoteModal(false);
            note.current = null;
            setNoteLoading(false);
          }}>
          {t('OK')}
        </Button>
      </BottomModal>
      <View style={{ flex: 1 }}>
        <BarcodeCameraView
          disabled={disableScan || showNoteModal || clientAction !== null}
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
          <TextSection
            title={t('ADDRESS')}
            value={entity?.address?.streetAddress}
          />
          <TextSection
            title={t('DELIVERY_DETAILS_RECIPIENT')}
            value={entity?.address?.contactName}
          />
          <TextSection title="Weight / Volume" value={entity?.weight} />
          <TextSection
            title={t('PHONE_NUMBER')}
            value={entity?.address?.telephone}
          />
          <TextSection title="Code" value={barcode} />
          <TextSection
            title={t('TASK_FORM_COMMENTS_LABEL')}
            value={entity?.comments}
            variant="note"
          />
        </ScrollView>
        <View
          style={{
            padding: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <IconButton
            _icon={{ as: Ionicons, name: 'call', color: 'green.500' }}
            disabled={entity?.address?.telephone == null}
            onPress={() => phonecall(entity?.address?.telephone, true)}
          />
          <Button
            width="70%"
            colorScheme={'dark'}
            disabled={entity == null}
            leftIcon={<Icon as={Ionicons} name="document" color="white" />}
            onPress={() => setShowNoteModal(true)}>
            Add Note
          </Button>
          <IconButton
            onPress={() =>
              NavigationHolder.dispatch(
                CommonActions.navigate('CourierBarcodeReport', { entity }),
              )
            }
            disabled={entity == null}
            _icon={{
              as: Ionicons,
              name: 'warning',
              color: 'red.500',
            }}
          />
        </View>
      </View>
    </>
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
    fontSize: 14,
  },
  section: { paddingVertical: 8 },
  title: { fontSize: 16, paddingBottom: 3 },
});

function mapStateToProps(state) {
  return {
    httpClient: state.app.httpClient,
    user: state.app.user,
    taskLists: selectTasks(state),
  };
}

function mapDispatchToProps(_dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(BarcodePage));
