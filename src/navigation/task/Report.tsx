import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import Complete from './Complete';
import { Edit } from './Edit';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useCallback, useState } from 'react';
import { TabBar } from './components/TabBar';
import { Header } from './components/Header';
import { useRoute, useTheme } from '@react-navigation/native';
import {
  ReportFormProvider,
  useReportFormContext,
} from './contexts/ReportFormContext';
import Task from '@/src/types/task';
import { Formik } from 'formik';
import { ReportIncidentFormValues } from '@/src/navigation/task/utils/taskFormHelpers';
import { useValidation } from '@/src/navigation/task/hooks/useValidation';

const Indicator = () => (
  <View
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(102, 102, 102, 0.2)',
      zIndex: 999,
    }}
  >
    <ActivityIndicator animating={true} size="large" />
  </View>
);

const ReportContent = ({ task }: { task?: Task }) => {
  const [currentTab, setCurrentTab] = useState<'edit' | 'report'>('report');
  const theme = useTheme();

  const handleTabChange = useCallback((tab: string) => {
    setCurrentTab(tab as 'edit' | 'report');
  }, []);

  const { isSubmitting } = useReportFormContext();

  const initialValues = {
    // Task-level fields
    address: {
      streetAddress: '',
      geo: { latitude: 0, longitude: 0 },
    },
    businessName: '',
    contactName: '',
    telephone: '',
    description: '',
    isValidAddress: false,
    before: '',
    after: '',
    weight: '0',
    packages: undefined,
    // Order-level fields
    manualSupplements: [],
    // Report incident-level fields
    failureReason: '',
    failureReasonMetadata: {},
    notes: '',
  } as ReportIncidentFormValues;

  const validate = useValidation();

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={() => {}}
      validateOnBlur={false}
      validateOnChange={false}
      enableReinitialize
    >
      {() => {
        return (
          <>
            {/*FIXME: display loading indicator when submitting; requires getting rid of the global loading indicator to avoid multiple loading indicators */}
            {/*{isSubmitting && <Indicator />}*/}
            <VStack style={{ flex: 1 }}>
              <HStack
                style={[
                  styles.tabBar,
                  { backgroundColor: theme.dark ? '#111111' : '#D9D9D9' },
                ]}
              >
                <TabBar onPress={handleTabChange} />
              </HStack>
              <Header task={task} />
              <View style={{ flex: 1, position: 'relative' }}>
                <View
                  style={[
                    styles.tabContent,
                    currentTab === 'report' ? styles.visible : styles.hidden,
                  ]}
                >
                  <Complete />
                </View>
                <View
                  style={[
                    styles.tabContent,
                    currentTab === 'edit' ? styles.visible : styles.hidden,
                  ]}
                >
                  <Edit task={task} currentTab={currentTab} />
                </View>
              </View>
            </VStack>
          </>
        );
      }}
    </Formik>
  );
};

export const Report = () => {
  const { params } = useRoute();
  const task = params?.task as Task | undefined;

  return (
    <ReportFormProvider initialTask={task}>
      <ReportContent task={task} />
    </ReportFormProvider>
  );
};

const styles = StyleSheet.create({
  header: {
    flex: 1,
    height: '5%',
    alignContent: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  buttonTab: {
    flex: 1,
    margin: 4,
    color: 'black',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    textAlignVertical: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
  },
  visible: {
    opacity: 1,
    zIndex: 1,
  },
  hidden: {
    opacity: 0,
    zIndex: 0,
  },
});
