import React from 'react';
import { Task } from '@/src/types/task';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { FormControl } from '@/components/ui/form-control';
import { EditFormInput } from './components/EditFormInput';
import i18n from '@/src/i18n';
import { ScrollView, StyleSheet } from 'react-native';
import { EditFormSelect } from './components/EditFormSelect';
import { Button, ButtonText } from '@/components/ui/button';
import { SubmitButton } from './components/SubmitButton';

interface TaskFormProps {
  task?: Partial<Task>;
  onSubmit: (data: Partial<Task>) => void;
  isLoading?: boolean;
}

const styles = StyleSheet.create({
  timeslotPackageTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    fontSize: 20,
    color: '#262627',
  },
});

export const EditTask: React.FC<TaskFormProps> = ({ task, onSubmit }) => {
  const { t } = i18n;

  return (
    <ScrollView>
      <VStack space={4} style={{ padding: 4 }}>
        <FormControl style={{ width: '100%', paddingHorizontal: 8 }}>
          <EditFormInput
            label="ORDER_CLIENT"
            helperText="ORDER_CLIENT_HELPER"
            value={task?.orgName || ''}
            handler={() => {}}
          />
          <EditFormInput
            label="ADDRESS"
            helperText="ADDRESS_HELPER"
            value={task?.address?.streetAddress || ''}
            handler={() => {}}
          />
          <EditFormInput
            label="BUSINESS"
            helperText="BUSINESS_HELPER"
            value={task?.address?.name || ''}
            handler={() => {}}
          />
          <EditFormInput
            label="CONTACT"
            helperText="CONTACT_HELPER"
            value={task?.address?.contactName || ''}
            handler={() => {}}
          />
          <EditFormInput
            label="PHONE"
            helperText="PHONE_HELPER"
            value={task?.address?.telephone || ''}
            handler={() => {}}
          />
          <EditFormInput
            label="ACCESS_INFORMATION"
            helperText="ACCESS_INFORMATION_HELPER"
            value={task?.address?.description || ''}
            handler={() => {}}
          />
          {/* Packages and timeslot section */}
          <Text style={styles.timeslotPackageTitle}>
            {t('TIMESLOT_PACKAGE_FORM')}
          </Text>
          <EditFormSelect
            label="TIMESLOT_TYPES"
            helperText="TIMESLOT_TYPES_HELPER"
            defaultValue={task?.packageDetails || ''}
            values={[]}
            handler={() => {}}
          />
          <EditFormSelect
            label="TIMESLOT"
            helperText="TIMESLOT_HELPER"
            defaultValue={task?.packageDetails || ''}
            values={[]}
            handler={() => {}}
          />
          <EditFormInput
            label="WEIGHT"
            helperText="WEIGHT_HELPER"
            value={task?.weight ? task.weight.toString() : ''}
            handler={() => {}}
          />
        </FormControl>
      </VStack>
        <SubmitButton
          task={task}
          tasks={[]}
          notes={[]}
          contactName={task?.address?.contactName}
          success={false}
          validateTaskAfterReport={false}
          failureReason={''}
          failureReasonMetadataToSend={[]}
        />
    </ScrollView>
  );
};
