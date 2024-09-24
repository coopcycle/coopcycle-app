import { useSelector } from 'react-redux';
import {
  selectIsLoading,
  selectIsSpinnerDelayEnabled,
} from '../redux/App/selectors';
import { useEffect, useState } from 'react';

export const useIsModalVisible = visibilitySelector => {
  const isVisible = useSelector(visibilitySelector);
  const isGlobalLoadingIndicatorVisible = useSelector(selectIsLoading);
  const isSpinnerDelayEnabled = useSelector(selectIsSpinnerDelayEnabled);

  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (isModalVisible === isVisible) {
      return;
    }

    if (isVisible) {
      // modal is about to be shown

      if (isGlobalLoadingIndicatorVisible) {
        // delay showing the modal until the loading spinner has been hidden
        return;
      }

      // 100ms see https://github.com/ladjs/react-native-loading-spinner-overlay?tab=readme-ov-file#recommended-implementation
      // plus add an extra delay to compensate for a delay added in the Spinner.js:
      const delay = isSpinnerDelayEnabled ? 500 : 100;
      setTimeout(() => setIsModalVisible(true), delay);
    } else {
      // modal is about to be hidden
      setIsModalVisible(false);
    }
  }, [isVisible, isGlobalLoadingIndicatorVisible, isSpinnerDelayEnabled, isModalVisible]);

  return isModalVisible;
};
