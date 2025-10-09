import React, {
  useCallback,
  useRef,
  useState,
  useMemo,
  useEffect,
} from 'react';
import { View, StyleSheet, Dimensions, PermissionsAndroid } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Button, ButtonText } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { Box } from '@/components/ui/box'
import { HStack } from '@/components/ui/hstack'
import { Spinner } from '@/components/ui/spinner'
import { Fab, FabIcon } from '@/components/ui/fab'
import { EditIcon } from '@/components/ui/icon'
import axios from 'axios';
import Config from 'react-native-config';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import AddressUtils from '../utils/Address';
import { localeDetector } from '../i18n';

import { useBackgroundContainerColor } from '../styles/theme';
import { LocateFixed } from 'lucide-react-native'

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const geocodingClient = axios.create({
  baseURL: 'https://maps.googleapis.com/maps/api',
  timeout: 5000,
});

const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Access Required',
        message:
          'We need your location to show you the map',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED
  } catch (err) {
    return null
  }
};

function MapPickerScreen({
  primaryColor,
  onSelectLocation,
  onCancel,
  initialLocation,
}) {
  const { t } = useTranslation();
  const defaultLocation = useSelector(state => state.app.settings.latlng);
  const location = initialLocation || defaultLocation;

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocated, setIsLocated] = useState(false);

  const mapRef = useRef(null);
  const locationRef = useRef(null);

  const backgroundColor = useBackgroundContainerColor();
  const initialRegion = useMemo(() => {
    if (!location) return null;

    try {
      const [lat, lng] = location.split(',').map(parseFloat);
      if (isNaN(lat) || isNaN(lng)) return null;

      return {
        latitude: lat,
        longitude: lng,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };
    } catch (e) {
      console.error('Failed to parse location:', e);
      return null;
    }
  }, [location]);

  const reverseGeocode = useMemo(
    () =>
      _.debounce(async location => {
        try {
          const { latitude, longitude } = location;
          const response = await geocodingClient.get(
            `/geocode/json?latlng=${latitude},${longitude}&key=${Config.GOOGLE_MAPS_BROWSER_KEY}&language=${localeDetector()}`,
          );

          if (response.data.results?.[0]) {
            const formattedAddress = {
              ...AddressUtils.createAddressFromGoogleGeocoding(
                response.data.results[0],
              ),
              isPrecise: true, //NOTE: See if forcing isPrecise on map pick is a good idea
            };
            setAddress(formattedAddress);
          } else {
            setAddress(null);
          }
        } catch (error) {
          console.error('Error with reverse geocoding:', error);
          setAddress(null);
        } finally {
          setIsLoading(false);
        }
      }, 300),
    [setAddress, setIsLoading],
  );

  useEffect(() => {
    requestLocationPermission()
  }, [])

  useEffect(() => {
    return () => {
      if (reverseGeocode && reverseGeocode.cancel) {
        reverseGeocode.cancel();
      }

      setSelectedLocation(null);
      setAddress(null);
      setIsLoading(false);
    };
  }, [reverseGeocode]);

  // Wrapper to set loading state before debounced function
  const handleReverseGeocode = useCallback(
    location => {
      setIsLoading(true);
      reverseGeocode(location);
    },
    [reverseGeocode],
  );

  const handleMapPress = useCallback(
    ({ nativeEvent: { coordinate } }) => {
      setSelectedLocation(coordinate);
      handleReverseGeocode(coordinate);
    },
    [handleReverseGeocode, setSelectedLocation],
  );

  const handleConfirm = useCallback(() => {
    if (selectedLocation && address && onSelectLocation) {
      onSelectLocation({
        location: `${selectedLocation.latitude},${selectedLocation.longitude}`,
        address,
      });
    }
  }, [selectedLocation, address, onSelectLocation]);

  const markerMemo = useMemo(() => {
    if (!selectedLocation) return null;

    return (
      <Marker
        coordinate={selectedLocation}
        pinColor={primaryColor}
        tracksViewChanges={false}
      />
    );
  }, [selectedLocation, primaryColor]);

  const renderAddressDisplay = useCallback(() => {
    if (isLoading) {
      return (
        <HStack space={2} justifyContent="center">
          <Spinner accessibilityLabel="Loading address" />
          <Text>{t('LOADING_ADDRESS')}</Text>
        </HStack>
      );
    }

    if (selectedLocation) {
      return address ? (
        <Text>{address.streetAddress}</Text>
      ) : (
        <Text>{t('ADDRESS_NOT_FOUND')}</Text>
      );
    }

    return <Text color="gray.400">{t('TAP_ON_MAP_TO_SELECT_LOCATION')}</Text>;
  }, [isLoading, selectedLocation, address, t]);

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <Fab
          disabled={!isLocated}
          onPress={() => {
            setSelectedLocation(locationRef.current);
            handleReverseGeocode(locationRef.current);
            mapRef.current.animateToRegion({
              ...locationRef.current,
              // Zoom closer
              latitudeDelta: LATITUDE_DELTA / 36,
              longitudeDelta: LONGITUDE_DELTA / 36,
            });
          }}
          size="lg"
          placement='top right'
          className="bg-primary-600 hover:bg-primary-700 active:bg-primary-800"
        >
          <FabIcon as={LocateFixed} />
        </Fab>
        {initialRegion && (
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={initialRegion}
            onPress={handleMapPress}
            moveOnMarkerPress={false}
            // Keep this disabled, somehow if the MapView must keep
            // a singleton instance in background.
            // If a map with lite-mode is shown before loading this screen
            // lite-mode will be enabled by default; even if this is set to false by default.
            // So i force lite-mode and seems to work fine
            liteMode={false}
            showsCompass={false}
            rotateEnabled={false}
            pitchEnabled={false}
            showsUserLocation={true}
            showsMyLocationButton={true}
            onUserLocationChange={({ nativeEvent: { coordinate } }) => {
              locationRef.current = coordinate;
              setIsLocated(true);
            }}
          >
            {markerMemo}
          </MapView>
        )}
      </View>

      <Box className='absolute p-4 bottom-0 w-full' style={{ backgroundColor }}>
        <Box
          className='p-4 mb-4 h-20 border-2 border-gray-200 rounded-md justify-center'>
          {renderAddressDisplay()}
        </Box>

        <Button
          className='mb-2'
          action='primary'
          isDisabled={!selectedLocation || !address}
          onPress={handleConfirm}
        >
          <ButtonText>{t('CONFIRM_LOCATION')}</ButtonText>
        </Button>
        <Button onPress={onCancel} variant="link" size="sm" action='secondary'>
          <ButtonText>{t('CANCEL')}</ButtonText>
        </Button>
      </Box>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  mapContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapPickerScreen;
