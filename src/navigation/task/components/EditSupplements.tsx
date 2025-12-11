import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@/components/ui/text';
import Range from '../../checkout/ProductDetails/Range';
import {
  SupplementWithQuantity,
} from '@/src/navigation/task/hooks/useSupplements';
import { Uri } from '@/src/redux/api/types';
import { useFormikContext } from 'formik';
import { EditFormValues } from '@/src/navigation/task/utils/taskFormHelpers';
import { ManualSupplementValues } from '@/src/types/task';

type Props = {
  availableSupplements: SupplementWithQuantity[];
};

export const SupplementSelector = ({ availableSupplements }: Props) => {
  const testID = "supplement-selector";
  const { t } = useTranslation();

  const { values, setFieldValue, setFieldTouched } = useFormikContext<EditFormValues>();

  const selectedSupplements = useMemo(() => {
    return values.manualSupplements
  }, [values.manualSupplements]);

  const addedSupplements = useMemo(() => {
    return selectedSupplements.map(supplement => {
       const s = availableSupplements.find(sup => sup.pricingRule === supplement.pricingRule);

       return {
        ...s,
        quantity: supplement.quantity
      };
    });
  }, [selectedSupplements, availableSupplements]);

  const setSelectedSupplements = (value: ManualSupplementValues[]) => {
    setFieldValue('manualSupplements', value);
    setFieldTouched('manualSupplements');
  };

  const handleSelectSupplement = (pricingRule: Uri) => {
    if (!pricingRule) return;

    const supplementToAdd = availableSupplements.find(sup => sup.pricingRule === pricingRule);

    if (supplementToAdd) {
      const existingSupplement = selectedSupplements.find(sup => sup.pricingRule === pricingRule);

      let updatedSupplements: ManualSupplementValues[];

      if (existingSupplement) {
        updatedSupplements = selectedSupplements.map(sup =>
          sup.pricingRule === pricingRule
            ? { ...sup, quantity: sup.quantity + 1 }
            : sup
        );
      } else {
        const newSupplement: ManualSupplementValues = {
          pricingRule: supplementToAdd.pricingRule,
          quantity: 1
        };
        updatedSupplements = [...selectedSupplements, newSupplement];
      }

      setSelectedSupplements(updatedSupplements);
    }
  };

  const handleIncrement = (pricingRule: Uri) => {
    const updatedSupplements = selectedSupplements.map(sup =>
      sup.pricingRule === pricingRule
        ? { ...sup, quantity: sup.quantity + 1 }
        : sup
    );

    setSelectedSupplements(updatedSupplements);
  };

  const handleDecrement = (pricingRule: Uri) => {
    const updatedSupplements = selectedSupplements.map(sup =>
      sup.pricingRule === pricingRule
        ? { ...sup, quantity: Math.max(0, sup.quantity - 1) }
        : sup
    ).filter(sup => sup.quantity > 0);

    setSelectedSupplements(updatedSupplements);
  };

  const renderSupplementItem = (item: SupplementWithQuantity, index: number) => (
    <View
      style={[styles.supplementItem]}
      key={item.pricingRule}
      testID={`${testID}-selected-item-${index}`}
    >
      <Range
        onPressIncrement={() => handleIncrement(item.pricingRule)}
        onPressDecrement={() => handleDecrement(item.pricingRule)}
        quantity={item.quantity}
        testID={`supplement-${index}`}
      />
      <TouchableOpacity
        style={styles.supplementLabel}
        onPress={() => handleIncrement(item.pricingRule)}
        testID={`${testID}-selected-item-${index}-label`}
      >
        <Text
          style={styles.supplementName}
          testID={`${testID}-selected-item-${index}-name`}
        >
          {item.name || 'Unknown'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container} testID={testID}>
      {addedSupplements.length > 0 && (
        <View
          style={styles.selectedSupplements}
          testID={`${testID}-selected-section`}
        >
          <Text
            style={styles.sectionTitle}
            testID={`${testID}-selected-title`}
          >
            {t('ADDED_SUPPLEMENTS')}
          </Text>
          {addedSupplements.map((item, index) => renderSupplementItem(item, index))}
        </View>
      )}

      <View testID={`${testID}-selector-section`}>
        <Text
          style={styles.selectorLabel}
          testID={`${testID}-selector-label`}
        >
          {t('ADD_SUPPLEMENT')}
        </Text>

        {availableSupplements && (
          <View
            style={styles.optionsContainer}
            testID={`${testID}-options-container`}
          >
            {availableSupplements.map((supplement, index) => (
              <TouchableOpacity
                key={supplement.pricingRule}
                style={styles.optionButton}
                onPress={() => handleSelectSupplement(supplement.pricingRule)}
                testID={`${testID}-option-${index}`}
              >
                <Text
                  style={styles.optionText}
                  testID={`${testID}-option-${index}-text`}
                >
                  {supplement.name || 'Unknown'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  selectedSupplements: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  supplementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 16,
    backgroundColor: 'transparent'
  },
  supplementLabel: {
    flex: 1,
  },
  supplementName: {
    fontSize: 14,
    color: '#333',
  },
  selectorLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  selectWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
  },
  selectButton: {
    padding: 12,
    backgroundColor: '#fff',
  },
  selectText: {
    fontSize: 14,
    color: '#333',
  },
  placeholderText: {
    fontSize: 14,
    color: '#6c757d',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  optionText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
});
