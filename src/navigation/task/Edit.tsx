import React from 'react';
import { Task } from '@/src/types/task';
import { VStack } from '@/components/ui/vstack';
import { FormControl } from '@/components/ui/form-control';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SubmitButton } from './components/SubmitButton';
import { SupplementSelector as EditSupplements } from './components/EditSupplements';
import { Formik } from 'formik';
import { Text } from '@/components/ui/text';
import { EditTaskFields } from '@/src/navigation/task/components/EditTaskFields';
import { useEditDetailsForm } from '@/src/navigation/task/hooks/useEditDetailsForm';
import { useTranslation } from 'react-i18next';
import { useSupplements } from '@/src/navigation/task/hooks/useSupplements';
import { Spinner } from '@/components/ui/spinner';

interface TaskFormProps {
  task: Task;
  currentTab: string;
}

export const Edit: React.FC<TaskFormProps> = ({ task, currentTab }) => {
  const { t } = useTranslation();
  const {
    store,

    initialValues,
    validate,
  } = useEditDetailsForm(task);

  const { supplements: availableSupplements } = useSupplements(store);

  if (!task.metadata?.order_number) {
    return (
      <SafeAreaView className="flex-1 align-items-center justify-center">
        <Text className="text-center">
          {t('TASK_DETAILS_NO_ORDER_CAN_NOT_EDIT')}
        </Text>
      </SafeAreaView>
    );
  }

  if (!initialValues) {
    return <Spinner />;
  }

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={() => {}}
      validateOnBlur={false}
      validateOnChange={false}
      enableReinitialize>
      {({
        handleSubmit: formikSubmit,
        values,
        touched,
      }) => {
        return (
          <SafeAreaView style={styles.wrapper}>
            <ScrollView
              testID="scrollView:edit"
              keyboardShouldPersistTaps="handled" // tap is handled by the children in the forms
              style={styles.container}
              contentContainerStyle={{ flexGrow: 1 }}>
              <VStack space={4} style={styles.content}>
                <FormControl style={styles.formControl}>
                  <EditTaskFields store={store} task={task} />
                  {/* Supplements */}
                  {availableSupplements && availableSupplements.length > 0 && (
                    <>
                      <Text style={styles.sectionTitle}>
                        {t('SUPPLEMENTS')}
                      </Text>
                      <EditSupplements
                        availableSupplements={availableSupplements}
                      />
                    </>
                  )}
                  <View style={{ marginBottom: 44, marginHorizontal: -12 }}>
                    <SubmitButton
                      task={task}
                      tasks={[]}
                      notes={''}
                      contactName={values.contactName}
                      success={false}
                      currentTab={currentTab}
                      formValues={values}
                      formTouchedFields={touched}
                      onPress={formikSubmit}
                    />
                  </View>
                </FormControl>
              </VStack>
            </ScrollView>
          </SafeAreaView>
        );
      }}
    </Formik>
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
  sectionTitle: {
    marginTop: 12,
    marginBottom: 4,
    fontWeight: 'bold',
    fontSize: 20,
    color: '#262627',
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
