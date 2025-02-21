import { Pressable, Text, View } from 'native-base';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ItemSeparator from '../../../components/ItemSeparator';
import {
  useBackgroundContainerColor,
  usePrimaryColor,
} from '../../../styles/theme';
import FormInput from './FormInput';

export default function ClientListInput({
  addresses,
  onSelectAddress,
  placeholder,
}) {
  const [hideSuggestions, setHideSuggestions] = useState(true);
  const [value, setValue] = useState('');
  const backgroundColor = useBackgroundContainerColor();
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
    setValue(address.contactName);
  }

  const styles = StyleSheet.create({
    autocompleteContainer: {
      flex: 1,
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
      zIndex: 1,
    },
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => selectAddress(item)}
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
        {`${item.name ?? ''} - ${item.contactName ?? ''}`}
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
        {`${item.streetAddress}`}
      </Text>
    </TouchableOpacity>
  );

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
        clearButtonMode="while-editing"
        inputContainerStyle={{
          margin: 0,
          padding: 0,
          borderWidth: 0,
          borderRadius: 4,
        }}
        listContainerStyle={{
          backgroundColor,
        }}
        containerStyle={{
          backgroundColor,
        }}
        // do not use default FlatList - see https://github.com/byteburgers/react-native-autocomplete-input/pull/230
        renderResultList={({ data, style }) => (
          <View
            style={[
              style,
              {
                backgroundColor,
                borderColor: primaryColor,
              },
            ]}>
            {data.map((item, index) => (
              <View key={index}>
                <Pressable>{renderItem({ item })}</Pressable>
                <ItemSeparator />
              </View>
            ))}
          </View>
        )}
      />
    </View>
  );
}
