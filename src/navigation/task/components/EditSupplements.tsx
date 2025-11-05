import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/ui/text';
import Range from '../../checkout/ProductDetails/Range';

interface Supplement {
  id: string;
  type: string;
  name: string;
  quantity: number;
}

interface SupplementSelectorProps {
  availableSupplements: Supplement[];
  onSupplementsChange: (supplements: Supplement[]) => void;
}

export const SupplementSelector: React.FC<SupplementSelectorProps> = ({
  availableSupplements,
  onSupplementsChange,
}) => {
  const [selectedSupplements, setSelectedSupplements] = useState<Supplement[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>('');

  const handleSelectSupplement = (supplementType: string) => {
    if (!supplementType) return;

    const supplementToAdd = availableSupplements.find(sup => sup.type === supplementType);
    
    if (supplementToAdd) {
      // Verificar si el suplemento ya está en la lista
      const existingSupplement = selectedSupplements.find(sup => sup.type === supplementType);
      
      let updatedSupplements: Supplement[];
      
      if (existingSupplement) {
        updatedSupplements = selectedSupplements.map(sup =>
          sup.type === supplementType
            ? { ...sup, quantity: sup.quantity + 1 }
            : sup
        );
      } else {
        const newSupplement: Supplement = {
          ...supplementToAdd,
          quantity: 1
        };
        updatedSupplements = [...selectedSupplements, newSupplement];
      }
      
      setSelectedSupplements(updatedSupplements);
      onSupplementsChange(updatedSupplements);
      
      setSelectedValue('');
    }
  };

  const handleIncrement = (supplementType: string) => {
    const updatedSupplements = selectedSupplements.map(sup =>
      sup.type === supplementType
        ? { ...sup, quantity: sup.quantity + 1 }
        : sup
    );
    
    setSelectedSupplements(updatedSupplements);
    onSupplementsChange(updatedSupplements);
  };

  const handleDecrement = (supplementType: string) => {
    const updatedSupplements = selectedSupplements.map(sup =>
      sup.type === supplementType
        ? { ...sup, quantity: Math.max(0, sup.quantity - 1) }
        : sup
    ).filter(sup => sup.quantity > 0); // Eliminar si la cantidad llega a 0
    
    setSelectedSupplements(updatedSupplements);
    onSupplementsChange(updatedSupplements);
  };

  const renderSupplementItem = (item: Supplement) => (
    <View style={styles.supplementItem} key={item.type}>
      <Range
        onPress={() => {}}
        onPressIncrement={() => handleIncrement(item.type)}
        onPressDecrement={() => handleDecrement(item.type)}
        quantity={item.quantity}
      />
      <TouchableOpacity
        style={styles.supplementLabel}
        onPress={() => handleIncrement(item.type)}>
        <Text style={styles.supplementName}>{item.name || item.type}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {selectedSupplements.length > 0 && (
        <View style={styles.selectedSupplements}>
          <Text style={styles.sectionTitle}>Suplementos agregados:</Text>
          {selectedSupplements.map(renderSupplementItem)}
        </View>
      )}

      {/* Select para agregar nuevos suplementos */}
      <View style={styles.selectorContainer}>
        <Text style={styles.selectorLabel}>Agregar suplemento:</Text>

        {/* Lista de opciones disponibles */}
        {availableSupplements && (<View style={styles.optionsContainer}>
          {availableSupplements.map(supplement => (
            <TouchableOpacity
              key={supplement.type}
              style={styles.optionButton}
              onPress={() => handleSelectSupplement(supplement.type)}
            >
              <Text style={styles.optionText}>{supplement.name || supplement.type}</Text>
            </TouchableOpacity>
          ))}
        </View>)}
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
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  supplementLabel: {
    flex: 1,
  },
  supplementName: {
    fontSize: 14,
    color: '#333',
  },
  selectorContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 16,
  },
  selectorLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
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