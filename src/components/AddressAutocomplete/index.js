// @see https://github.com/uuidjs/uuid#getrandomvalues-not-supported
import { circle, transformRotate } from '@turf/turf';
import { AbortController } from 'abortcontroller-polyfill/dist/cjs-ponyfill';
import axios from 'axios';
import Fuse from 'fuse.js';
import _ from 'lodash';
import { Icon, Input, Text, useColorModeValue } from 'native-base';
import PropTypes from 'prop-types';
import qs from 'qs';
import React, { useCallback, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import Config from 'react-native-config';
import 'react-native-get-random-values';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { localeDetector } from '../../i18n';
import { darkGreyColor, whiteColor } from '../../styles/common';
import { useBaseTextColor } from '../../styles/theme';
import AddressUtils from '../../utils/Address';
import ItemSeparator from '../ItemSeparator';
import PostCodeButton from './components/PostCodeButton';
import PoweredByGoogle from './powered/PoweredByGoogle';

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

function AddressAutocomplete(props) {
  const {
    country,
    t,
    value,
    addresses,
    style,
    flatListProps,
    onSelectAddress,
    placeholder,
    ...otherProps
  } = props;

  const [query, setQuery] = useState(
    _.isObject(value) ? value.streetAddress || '' : value || '',
  );
  const [results, setResults] = useState([]);
  const [postcode, setPostcode] = useState(
    _.isObject(value) ? { postcode: value.postalCode } : null,
  );
  const [sessionToken, setSessionToken] = useState(null);
  const [controller, setController] = useState(null);

  const fuse = new Fuse(addresses, fuseOptions);

  const autocomplete = useCallback(
    _.debounce((text, query) => {
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
        axios
          .get(
            `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
              text,
            )}&${qs.stringify(query)}`,
            { signal: newController.signal },
          )
          .then(response => {
            const normalizedResults = fuseResults.map(fuseResult => ({
              ...fuseResult.item,
              type: 'fuse',
            }));

            const normalizedPredictions = response.data.predictions.map(
              prediction => ({
                ...prediction,
                type: 'prediction',
              }),
            );

            let results = normalizedResults.concat(normalizedPredictions);

            if (normalizedResults.length > 0 && results.length > 5) {
              results = results.slice(0, 5);
            }

            setResults(results);
          })
          .catch(error => {
            console.log('AddressAutocomplete; _autocomplete', error);
          });
      }
    }, 300),
    [country, postcode, fuse],
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

    if (text.length < props.minChars) {
      setResults([]);
      return;
    }

    // Construire la requête pour l'autocomplete
    const queryParams = {
      key: Config.GOOGLE_MAPS_BROWSER_KEY,
      language: localeDetector(),
      types: 'geocode',
      locationrestriction: `rectangle:${props.southWest}|${props.northEast}`,
      sessiontoken: newSessionToken,
    };

    // Exécuter l'autocomplete
    autocomplete(text, queryParams);
  }

  function onItemPress(item) {
    if (item.type === 'prediction') {
      const queryParams = {
        key: Config.GOOGLE_MAPS_BROWSER_KEY,
        language: localeDetector(),
        placeid: item.place_id,
        sessiontoken: sessionToken,
      };

      // Réinitialiser le sessionToken après la sélection
      setSessionToken(null);

      // Appel à l'API Google Place Details
      axios
        .get(
          `https://maps.googleapis.com/maps/api/place/details/json?${qs.stringify(
            queryParams,
          )}`,
        )
        .then(response => {
          setQuery(item.description);
          setResults([]);
          props.onSelectAddress(
            AddressUtils.createAddressFromGoogleDetails(response.data.result),
          );
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
        <Text
          style={{ fontSize: 14, flex: 1, color: props.itemTextColor }}
          numberOfLines={1}
          ellipsizeMode="tail">
          {text}
        </Text>
        {item.type === 'fuse' && (
          <Icon
            as={FontAwesome5}
            name="star"
            regular
            style={{
              fontSize: 16,
              color: props.itemTextColor,
              paddingLeft: 5,
            }}
          />
        )}
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
      <View style={styles.textInput}>
        <Input
          {...inputProps}
          style={[inputProps.style, { flex: 1 }]}
          onFocus={onTextInputFocus}
          onBlur={onTextInputBlur}
        />
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
      {props.renderRight && props.renderRight()}
    </View>
  );

  let finalPlaceholder = placeholder || props.t('ENTER_ADDRESS');
  if (props.country === 'gb' && !postcode) {
    finalPlaceholder = props.t('ENTER_POSTCODE');
  }

  return (
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
      flatListProps={{
        style: {
          margin: 0, // reset default margins on Android
          backgroundColor: props.controlBackgroundColor,
        },
        keyboardShouldPersistTaps: 'always',
        keyExtractor: (item, i) => `prediction-${i}`,
        renderItem: renderItem, // Use the renderItem method (either passed as a prop or defined in your hook)
        ItemSeparatorComponent: ItemSeparator,
        ListFooterComponent:
          props.country === 'gb'
            ? PoweredByIdealPostcodes(styles.poweredContainer)
            : PoweredByGoogle(styles.poweredContainer),
        ...flatListProps,
      }}
      renderTextInput={inputProps => renderTextInput(inputProps)}
      style={{
        color: props.baseTextColor,
        backgroundColor: props.controlBackgroundColor,
        borderColor: '#b9b9b9',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderWidth: 1,
        ...style,
      }}
    />
  );
}

AddressAutocomplete.defaultProps = {
  minChars: 3,
  addresses: [],
  renderRight: () => <View />,
};

AddressAutocomplete.propTypes = {
  minChars: PropTypes.number,
  addresses: PropTypes.array,
  renderRight: PropTypes.func,
};

const styles = StyleSheet.create({
  poweredContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: 5,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  textInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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

    const controlBackgroundColor = useColorModeValue(whiteColor, darkGreyColor);
    const itemTextColor = useColorModeValue('#856404', baseTextColor);

    return (
      <ClassComponent
        {...props}
        baseTextColor={baseTextColor}
        controlBackgroundColor={controlBackgroundColor}
        itemTextColor={itemTextColor}
      />
    );
  };
}

export default connect(mapStateToProps)(
  withTranslation()(withHooks(AddressAutocomplete)),
);