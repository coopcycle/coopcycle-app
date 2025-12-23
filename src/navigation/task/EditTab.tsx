import React, { useEffect } from 'react';
import { Task } from '@/src/types/task';
import { VStack } from '@/components/ui/vstack';
import { FormControl } from '@/components/ui/form-control';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SubmitButton } from './components/SubmitButton';
import { SupplementSelector as EditSupplements } from './components/EditSupplements';
import { useFormikContext } from 'formik';
import { Text } from '@/components/ui/text';
import { EditTaskFields } from '@/src/navigation/task/components/EditTaskFields';
import { useEditDetailsForm } from '@/src/navigation/task/hooks/useEditDetailsForm';
import { useTranslation } from 'react-i18next';
import { useSupplements } from '@/src/navigation/task/hooks/useSupplements';
import { Spinner } from '@/components/ui/spinner';
import {
  EditFormValues,
  canEditTask,
} from '@/src/navigation/task/utils/taskFormHelpers';
import { ErrorText } from '@/src/components/ErrorText';
import { SectionTitleText } from '@/src/navigation/task/components/SectionTitleText';
import { SectionTitle } from '@/src/navigation/task/components/SectionTitle';

interface TaskFormProps {
  task: Task;
  currentTab: string;
}

export const EditTab: React.FC<TaskFormProps> = ({ task, currentTab }) => {
  const { t } = useTranslation();

  const { values, setValues } = useFormikContext<EditFormValues>();

  const {
    store,

    initialValues,
    initialValuesLoading,
    initialValuesError,
  } = useEditDetailsForm(task);

  const { supplements: availableSupplements } = useSupplements(store);

  // set initial values for the Edit page when they are loaded
  useEffect(() => {
    if (!initialValues) {
      return;
    }

    setValues(initialValues);
  }, [initialValues, setValues]);

  if (!canEditTask(task)) {
    return (
      <View className="flex-1 align-items-center justify-center">
        <Text className="text-center">
          {t(
            task.metadata?.order_number
              ? 'TASK_DETAILS_CAN_NOT_EDIT'
              : 'TASK_DETAILS_CAN_NOT_EDIT_NO_ORDER',
          )}
        </Text>
      </View>
    );
  }

  if (initialValuesLoading) {
    return <Spinner />;
  }

  if (initialValuesError || !initialValues) {
    return (
      <View style={{ padding: 16 }}>
        <ErrorText message={t('AN_ERROR_OCCURRED')} />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView
        testID="scrollView:edit"
        keyboardShouldPersistTaps="handled" // tap is handled by the children in the forms
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <VStack space={4} style={styles.content}>
          <FormControl style={styles.formControl}>
            <EditTaskFields store={store} task={task} />
            {/* Supplements */}
            {availableSupplements && availableSupplements.length > 0 && (
              <>
                <SectionTitle>
                  <SectionTitleText text={t('SUPPLEMENTS')} />
                </SectionTitle>
                <EditSupplements availableSupplements={availableSupplements} />
              </>
            )}
          </FormControl>
        </VStack>
      </ScrollView>
      <View>
        <SubmitButton
          task={task}
          tasks={[]}
          notes={''}
          contactName={values.contactName}
          success={false}
          currentTab={currentTab}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 4,
  },
  formControl: {
    width: '100%',
    paddingHorizontal: 8,
  },
  autocompleteWrapper: {
    height: 24,
    ...Platform.select({
      android: {
        flex: 1,
        top: 0,
        right: 0,
        left: 0,
        zIndex: 1,
      },
      ios: {
        top: 0,
        right: 0,
        left: 0,
        zIndex: 10,
        overflow: 'visible',
      },
    }),
  },
});
