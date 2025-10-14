// @see https://github.com/uuidjs/uuid#getrandomvalues-not-supported
import { circle, transformRotate } from '@turf/turf';
import { AbortController } from 'abortcontroller-polyfill/dist/cjs-ponyfill';
import axios from 'axios';
import Fuse from 'fuse.js';
import _ from 'lodash';
import { useColorModeValue } from '../styles/theme';
import { HStack } from '@/components/ui/hstack';
import { Icon, StarIcon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import PropTypes from 'prop-types';
import qs from 'qs';
import React, { useMemo, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import Config from 'react-native-config';
import 'react-native-get-random-values';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Locate } from 'lucide-react-native';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { localeDetector } from '../i18n';
import {
  useBackgroundContainerColor,
  useBaseTextColor,
  usePrimaryColor,
} from '../styles/theme';
import AddressUtils from '../utils/Address';
import PostCodeButton from './AddressAutocomplete/components/PostCodeButton';
import PoweredByGoogle from './AddressAutocomplete/powered/PoweredByGoogle';
import { PoweredByIdealPostcodes } from './AddressAutocomplete/powered/PoweredByIdealPostcodes';
import ItemSeparator from './ItemSeparator';
import MapPickerScreen from './MapPickerModal';

const fuseOptions = {
  shouldSort: true,
  includeScore: true,
  threshold: 0.1,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: ['contactName', 'streetAddress'],
};

function AddressAutocomplete({
  country,
  t,
  value,
  addresses = [],
  minChars = 3,
  renderRight = () => <View />,
  containerStyle,
  inputContainerStyle,
  listContainerStyle,
  style,
  flatListProps,
  onSelectAddress,
  placeholder,
  onMapPickerPress,
  location,
  mapPickerStyle = 'small',
  ...otherProps
}) {
  const props = arguments[0];

  const [query, setQuery] = useState(
    _.isObject(value) ? value.streetAddress || '' : value || '',
  );
  const [results, setResults] = useState([]);
  const [postcode, setPostcode] = useState(
    _.isObject(value) ? { postcode: value.postalCode } : null,
  );
  const [sessionToken, setSessionToken] = useState(null);
  const [controller, setController] = useState(null);

  const [showPickerModal, setShowPickerModal] = useState(false);

  const fuse = useMemo(() => new Fuse(addresses, fuseOptions), [addresses]);

  const autoCompleteDebounced = useMemo(
    () =>
      _.debounce((text, config) => {
        const newController = new AbortController();
        setController(newController);
        const fuseResults = fuse.search(text, { limit: 2 });

        if (country === 'gb') {
          if (!postcode) {
            axios
              .get(
                `https://api.postcodes.io/postcodes/${text.replace(
                  /\s/g,
                  '',
                )}/autocomplete`,
                { signal: newController.signal },
              )
              .then(response => {
                if (
                  response.data.status === 200 &&
                  Array.isArray(response.data.result)
                ) {
                  const normalizedPostcodes = response.data.result.map(
                    postcode => ({
                      postcode: postcode,
                      type: 'postcode',
                    }),
                  );
                  setResults(normalizedPostcodes);
                }
              })
              .catch(error => {
                console.log('AddressAutocomplete; _autocomplete', error);
              });
          } else {
            setResults([
              {
                type: 'manual_address',
                description: text,
              },
            ]);
          }
        } else {
          let normalizedPredictions;

          axios
            .post(
              'https://places.googleapis.com/v1/places:autocomplete',
              {
                input: text,
                sessionToken: config.sessiontoken,
                locationRestriction: {
                  rectangle: {
                    low: {
                      latitude:
                        config.locationrestriction.southWest.split(',')[0],
                      longitude:
                        config.locationrestriction.southWest.split(',')[1],
                    },
                    high: {
                      latitude:
                        config.locationrestriction.northEast.split(',')[0],
                      longitude:
                        config.locationrestriction.northEast.split(',')[1],
                    },
                  },
                },
                includedPrimaryTypes: ['street_address'],
                languageCode: config.languageCode,
              },
              {
                headers: { 'X-Goog-Api-Key': config.key },
                // signal: controller.signal
              },
            )
            .then(response => {
              // when there is no response the API returns an empty response
              const suggestions = response.data.suggestions
                ? response.data.suggestions
                : [];

              normalizedPredictions = suggestions.map(suggestion => ({
                ...suggestion,
                description: suggestion.placePrediction.text.text,
                place_id: suggestion.placePrediction.placeId,
                type: 'prediction',
              }));

              const normalizedResults = fuseResults.map(fuseResult => ({
                ...fuseResult.item,
                type: 'fuse',
              }));

              let results = normalizedResults.concat(normalizedPredictions);

              if (normalizedResults.length > 0 && results.length > 5) {
                results = results.slice(0, 5);
              }

              setResults(results);
            })
            .catch(error => {
              console.error('AddressAutocomplete; _autocomplete', error);
            });
        }
      }, 500),
    [country, fuse, postcode],
  );

  function onChangeText(text) {
    if (controller) {
      controller.abort();
    }

    let newSessionToken = sessionToken;
    if (!sessionToken) {
      newSessionToken = uuidv4();
      setSessionToken(newSessionToken);
    }

    setQuery(text);

    if (props.onChangeText) {
      props.onChangeText(text);
    }

    if (text.length < minChars) {
      setResults([]);
      return;
    }

    // Construire la requête pour l'autocomplete
    const queryParams = {
      key: Config.GOOGLE_MAPS_BROWSER_KEY,
      languageCode: localeDetector(),
      types: 'geocode',
      locationrestriction: {
        southWest: props.southWest,
        northEast: props.northEast,
      },
      sessiontoken: newSessionToken,
    };

    // Exécuter l'autocomplete
    autoCompleteDebounced(text, queryParams);
  }

  function onItemPress(item) {
    if (item.type === 'prediction') {
      const queryParams = {
        key: Config.GOOGLE_MAPS_BROWSER_KEY,
        languageCode: localeDetector(),
        fields: [
          'addressComponents',
          'location',
          'formattedAddress',
          'types',
        ].join(','), // need to be specified explictly
      };

      // Réinitialiser le sessionToken après la sélection
      setSessionToken(null);

      // Appel à l'API Google Place Details
      axios
        .get(
          `https://places.googleapis.com/v1/places/${item.place_id
          }?${qs.stringify(queryParams)}`,
        )
        .then(response => {
          setQuery(item.description);
          setResults([]);
          const formattedAddress = AddressUtils.createAddressFromGoogleDetails(
            response.data,
          );
          props.onSelectAddress(formattedAddress);
        })
        .catch(error => {
          console.log('AddressAutocomplete; _onItemPress', error);
        });
    }

    if (item.type === 'postcode') {
      axios
        .get(`https://api.postcodes.io/postcodes/${item.postcode}`)
        .then(response => {
          if (response.data.status === 200 && response.data.result) {
            setQuery('');
            setResults([]);
            setPostcode(response.data.result);
          }
        })
        .catch(error => {
          console.log('AddressAutocomplete; _onItemPress', error);
        });
    }

    if (item.type === 'fuse') {
      props.onSelectAddress(item);
    }

    if (item.type === 'manual_address') {
      setResults([]);
      props.onSelectAddress(
        AddressUtils.createAddressFromPostcode(postcode, item.description),
      );
    }
  }

  function renderItem({ item }) {
    const itemStyle = [styles.item];

    let text = item.description;

    if (item.type === 'fuse') {
      const parts = [item.streetAddress];
      if (item.contactName && item.contactName.length > 0) {
        parts.unshift(item.contactName);
      }
      text = parts.join(' - ');
      itemStyle.push({
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      });
    }

    if (item.type === 'postcode') {
      text = item.postcode;
    }

    let itemProps = {};
    if (item.type === 'prediction') {
      itemProps = {
        ...itemProps,
        testID: `placeId:${item.place_id}`,
      };
    }

    return (
      <TouchableOpacity
        onPress={() => onItemPress(item)}
        style={itemStyle}
        {...itemProps}>
        <HStack>
          <Text
            style={{ fontSize: 14, flex: 1, color: props.itemTextColor }}
            numberOfLines={1}
            ellipsizeMode="tail">
            {text}
          </Text>
          {item.type === 'fuse' && (
            <Icon
              as={StarIcon}
              className="pl-2"
              style={{
                color: props.itemTextColor,
              }}
            />
          )}
        </HStack>
      </TouchableOpacity>
    );
  }

  function onTextInputFocus(e) {
    if (addresses.length > 0) {
      setResults(
        addresses.map(address => ({
          ...address,
          type: 'fuse',
        })),
      );
    }
    if (props.onFocus && typeof props.onFocus === 'function') {
      props.onFocus(e);
    }
  }

  function onTextInputBlur(e) {
    setResults([]);
    if (props.onBlur && typeof props.onBlur === 'function') {
      props.onBlur(e);
    }
  }

  const renderTextInput = inputProps => (
    <View style={styles.textInput}>
      {mapPickerStyle === 'small' && (
        <Button className="p-3 mr-2"
          onPress={() => setShowPickerModal(true)}
          testID="map-picker-button"
          accessibilityLabel={t('PICK_ON_MAP')}>
          <ButtonIcon as={Locate} />
        </Button>
      )}
      <View style={styles.textInput}>
        <Input className="flex-1">
          <InputField
            {...inputProps}
            style={[
              inputProps.style,
              {
                backgroundColor: props.backgroundColor,
                fontSize: 14,
                height: 40,
                paddingLeft: 8,
              },
            ]}
            placeholderTextColor={props.placeholderTextColor}
            onFocus={onTextInputFocus}
            onBlur={onTextInputBlur}
          />
        </Input>
        {props.country === 'gb' && postcode && (
          <PostCodeButton
            postcode={postcode.postcode}
            onPress={() => {
              setQuery('');
              setResults([]);
              setPostcode(null);
            }}
          />
        )}
      </View>
      {renderRight && renderRight()}
    </View>
  );

  let finalPlaceholder = placeholder || props.t('ENTER_ADDRESS');
  if (props.country === 'gb' && !postcode) {
    finalPlaceholder = props.t('ENTER_POSTCODE');
  }

  return (
    <>
      <Modal
        isVisible={showPickerModal}
        onBackdropPress={() => setShowPickerModal(false)}
        onBackButtonPress={() => setShowPickerModal(false)}>
        <View style={{ flex: 1 }}>
          <MapPickerScreen
            primaryColor={props.primaryColor}
            onSelectLocation={({ address }) => {
              setShowPickerModal(false);
              props.onSelectAddress(address);
            }}
            onCancel={() => setShowPickerModal(false)}
            initialRegion={location}
          />
        </View>
      </Modal>
      <View style={styles.autocompleteContainer}>
        <Autocomplete
          autoCompleteType="off"
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
          {...otherProps}
          data={results}
          value={query}
          placeholder={finalPlaceholder}
          onChangeText={onChangeText}
          // do not use default FlatList - see https://github.com/byteburgers/react-native-autocomplete-input/pull/230
          renderResultList={({ data, listContainerStyle }) => (
            <View style={[listContainerStyle, { marginTop: 0 }]}>
              <View
                style={{
                  borderTopWidth: 0,
                  borderWidth: 1,
                  borderColor: props.primaryColor,
                }}>
                {data.map((item, index) => (
                  <View key={index}>
                    <Pressable>{renderItem({ item })}</Pressable>
                    <ItemSeparator />
                  </View>
                ))}
                {props.country === 'gb' ? (
                  <PoweredByIdealPostcodes style={styles.poweredContainer} />
                ) : (
                  <PoweredByGoogle style={styles.poweredContainer} />
                )}
              </View>
            </View>
          )}
          renderTextInput={inputProps => renderTextInput(inputProps)}
          containerStyle={{
            ...containerStyle,
          }}
          inputContainerStyle={{
            borderWidth: 0,
            ...inputContainerStyle,
          }}
          listContainerStyle={{
            backgroundColor: props.backgroundColor,
            ...listContainerStyle,
          }}
          style={{
            ...style,
          }}
        />
        {mapPickerStyle === 'large' && (
          <>
            <Text style={styles.orText}>{t('FIND_ON_MAP')}</Text>
            <Button
              onPress={() => setShowPickerModal(true)}
              testID="map-picker-button-large"
              accessibilityLabel={t('PICK_ON_MAP')}>
              <ButtonText>Find me</ButtonText>
            </Button>
          </>
        )}
      </View>
    </>
  );
}

AddressAutocomplete.propTypes = {
  minChars: PropTypes.number,
  addresses: PropTypes.array,
  renderRight: PropTypes.func,
  onMapPickerPress: PropTypes.func,
  mapPickerStyle: PropTypes.oneOf(['small', 'large']),
};

const styles = StyleSheet.create({
  poweredContainer: {
    alignItems: 'flex-end',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  textInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputField: {
    fontSize: 14,
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
  orText: {
    marginVertical: 16,
    textAlign: 'center',
  },
});

function mapStateToProps(state) {
  const [lat, lng] = state.app.settings.latlng.split(',');

  // This will create a polygon with 4 sides (i.e a square)
  const options = { steps: 4, units: 'kilometers' };
  const polygon = circle([lng, lat], 50, options);
  const bbox = transformRotate(polygon, 45);

  const northEast = bbox.geometry.coordinates[0][0];
  const southWest = bbox.geometry.coordinates[0][2];

  return {
    location: state.app.settings.latlng,
    country: state.app.settings.country,
    northEast: [northEast[1], northEast[0]].join(','),
    southWest: [southWest[1], southWest[0]].join(','),
  };
}

function withHooks(ClassComponent) {
  return function CompWithHook(props) {
    const baseTextColor = useBaseTextColor();

    const itemTextColor = useColorModeValue('#856404', baseTextColor);

    const backgroundColor = useBackgroundContainerColor();
    const primaryColor = usePrimaryColor();

    return (
      <ClassComponent
        {...props}
        baseTextColor={baseTextColor}
        backgroundColor={backgroundColor}
        itemTextColor={itemTextColor}
        primaryColor={primaryColor}
      />
    );
  };
}

export default connect(mapStateToProps)(
  withTranslation()(withHooks(AddressAutocomplete)),
);
