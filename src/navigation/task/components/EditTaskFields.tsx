import React, { useMemo } from 'react';
import { Task } from '@/src/types/task';
import { StyleSheet, View } from 'react-native';
import { useFormikContext } from 'formik';
import { Text } from '@/components/ui/text';
import { EditTimeRange } from '@/src/navigation/task/components/EditTimeRange';
import { useGetStoreTimeSlotsQuery } from '@/src/redux/api/slice';
import { PackagesInput } from '@/src/navigation/delivery/components/PackagesInput';
import { usePackages } from '@/src/navigation/task/hooks/usePackages';
import { WeightInput } from '@/src/navigation/delivery/components/WeightInput';
import { useTranslation } from 'react-i18next';
import { FormField } from '@/src/navigation/task/components/FormField';
import { EditTaskFormValues } from '@/src/navigation/task/utils/taskFormHelpers';
import { AddressFields } from '@/src/navigation/delivery/components/AddressFields';
import { Store } from '@/src/redux/api/types';

interface TaskFormProps {
  store?: Store;
  task: Task;
}

export const EditTaskFields: React.FC<TaskFormProps> = ({ store, task }) => {
  const { t } = useTranslation();

  const { errors, touched } = useFormikContext<EditTaskFormValues>();

  const { data: timeSlots } = useGetStoreTimeSlotsQuery(store?.['@id'], {
    skip: !store?.['@id'],
  });

  const hasTimeSlot = useMemo(() => {
    if (!store) {
      return false;
    }

    // wait for the time slots to be loaded
    if (timeSlots === undefined) {
      return undefined;
    }

    return timeSlots && timeSlots.length > 0;
  }, [timeSlots, store]);

  const { storePackages, packagesWithQuantity, canEditPackages } = usePackages(
    task,
    store,
  );

  return (
    <>
      <AddressFields store={store} shouldAssertDelivery={false} />
      {/* Packages and Timeslot Section */}
      <Text style={styles.sectionTitle}>
        {t('STORE_NEW_DELIVERY_PACKAGES_TITLE')}
      </Text>
      {/* Time range (after/before or timeslot) */}
      <View style={styles.timeSlot}>
        {hasTimeSlot !== undefined ? (
          <EditTimeRange
            hasTimeSlot={hasTimeSlot}
            timeSlots={timeSlots || []}
          />
        ) : null}
      </View>
      {/* Weight */}
      {store ? (
        <FormField
          label={t('STORE_NEW_DELIVERY_WEIGHT')}
          error={errors.weight}
          touched={touched.weight}>
          {/* if it's not a task where we can edit packages, we assume the weight is not editable as well */}
          <WeightInput disabled={!canEditPackages} />
        </FormField>
      ) : null}
      {/* Packages */}
      {storePackages && storePackages.length > 0 && packagesWithQuantity ? (
        <FormField
          label={t('STORE_NEW_DELIVERY_PACKAGES')}
          error={errors.packages}>
          <View style={styles.packagesContainer}>
            <PackagesInput
              packages={storePackages}
              initialPackagesCount={packagesWithQuantity}
              disabled={!canEditPackages}
            />
          </View>
        </FormField>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    marginTop: 12,
    marginBottom: 4,
    fontWeight: 'bold',
    fontSize: 20,
    color: '#262627',
  },
  timeSlot: {
    marginBottom: 16,
  },
  textArea: {
    height: 80,
  },
  packagesContainer: {
    gap: 16,
    marginTop: 4,
  },
});
