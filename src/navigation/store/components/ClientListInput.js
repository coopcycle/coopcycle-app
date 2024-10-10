import { Text, View } from 'native-base';
import { useState } from 'react';
import Autocomplete from 'react-native-autocomplete-input';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ItemSeparator from '../../../components/ItemSeparator';
import {
  useBackgroundContainerColor,
  usePrimaryColor,
} from '../../../styles/theme';
import FormInput from './FormInput';
import { StyleSheet } from 'react-native';

export default function ClientListInput({
  addresses,
  onSelectAddress,
  placeholder,
}) {
  const [hideSuggestions, setHideSuggestions] = useState(true);
  const [value, setValue] = useState('');
  const backgroundContainerColor = useBackgroundContainerColor();
  const primaryColor = usePrimaryColor();

  function handleFocus() {
    setHideSuggestions(false);
  }

  function handleBlur() {
    setHideSuggestions(true);
  }

  function handleChangeText(text) {
    if (hideSuggestions) setHideSuggestions(false);
    setValue(text);
  }

  function RenderedInput() {
    return (
      <FormInput
        autoCorrect={false}
        returnKeyType="done"
        onBlur={handleBlur}
        onFocus={handleFocus}
        value={value}
        onChangeText={handleChangeText}
        placeholder={placeholder}
      />
    );
  }

  function selectAddress(address) {
    onSelectAddress(address);
    setHideSuggestions(true);
    setValue('');
  }

  const styles = StyleSheet.create({
    autocompleteContainer: {
      flex: 1,
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
      zIndex: 1
    }
  });

  return (
    <View style={styles.autocompleteContainer}>
      <Autocomplete
        hideResults={hideSuggestions}
        data={
          value
            ? addresses.filter(({ name, contactName, streetAddress }) =>
                [name, contactName, streetAddress].some(field =>
                  field?.toLowerCase().includes(value.toLowerCase()),
                ),
              )
            : addresses
        }
        renderTextInput={RenderedInput}
        onChangeText={handleChangeText}
        inputContainerStyle={{
          margin: 0,
          padding: 0,
          borderWidth: 0,
          borderRadius: 4,
        }}
        flatListProps={{
          style: {
            top: -2,
            borderWidth: 1,
            borderTopWidth: 0,
            borderColor: primaryColor,
            borderRadius: 4,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            marginTop: -1,
            backgroundColor: backgroundContainerColor,
          },
          keyboardShouldPersistTaps: 'always',
          keyExtractor: (item, i) => `prediction-${i}`,
          renderItem: item => (
            <TouchableOpacity
              onPress={() => selectAddress(item.item)}
              style={{
                padding: 12,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  flex: 1,
                  margin: 0,
                  padding: 0,
                  borderWidth: 0,
                }}
                numberOfLines={1}
                ellipsizeMode="tail">
                {`${item.item.name ?? ''} - ${item.item.contactName ?? ''}`}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  flex: 1,
                  margin: 0,
                  padding: 0,
                  borderWidth: 0,
                }}
                numberOfLines={1}
                ellipsizeMode="tail">
                {`${item.item.streetAddress}`}
              </Text>
            </TouchableOpacity>
          ),
          ItemSeparatorComponent: ItemSeparator,
        }}
        style={{}}
      />
    </View>
  );
}
