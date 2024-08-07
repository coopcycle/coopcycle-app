import { Text } from 'native-base';
import { useState } from 'react';
import AutocompleteInput from 'react-native-autocomplete-input';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ItemSeparator from '../../components/ItemSeparator';
import {
  useBackgroundColor,
  useBackgroundContainerColor,
  useBackgroundHighlightColor,
  usePrimaryColor,
} from '../../styles/theme';
import FormInput from './components/FormInput';

// const shadowStyle = {
//   shadowColor: '#000',
//   shadowOffset: {
//     width: 0,
//     height: 6,
//   },
//   shadowOpacity: 10.39,
//   shadowRadius: 8.3,

//   elevation: 13,
// };

export default function ClientListInput({
  addresses,
  onSelectAddress,
  placeholder,
}) {
  const [hideSuggestions, setHideSuggestions] = useState(true);
  const [value, setValue] = useState('');
  const backgroundContainerColor = useBackgroundContainerColor();
  const backgroundHighlightColor = useBackgroundHighlightColor();
  const backgroundColor = useBackgroundColor();
  // const shadowColor = useColorModeValue('rgba(0,0,0,.39)', 'rgba(0,0,0,1)');
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

  return (
    <>
      <AutocompleteInput
        hideResults={hideSuggestions}
        data={
          value
            ? addresses.filter(({ name, contactName, streetAddress }) =>
                [name, contactName, streetAddress].some(field =>
                  field.toLowerCase().includes(value.toLowerCase()),
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
            borderWidth: 1,
            borderTopWidth: 1,
            borderColor: primaryColor,
            borderRadius: 4,
            marginTop: -1,
            backgroundColor: backgroundContainerColor,
            // overflow: 'visible',

            // ...{ ...shadowStyle, shadowColor },
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
                {`${item.item.name} - ${item.item.contactName}`}
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
    </>
  );
}
