import { useSelector } from 'react-redux';
import { selectIsLoading } from '../redux/App/selectors';
import { useEffect, useState } from 'react';

export const useIsModalVisible = visibilitySelector => {
  const isVisible = useSelector(visibilitySelector);
  const isGlobalLoadingIndicatorVisible = useSelector(selectIsLoading);

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

      // https://github.com/ladjs/react-native-loading-spinner-overlay?tab=readme-ov-file#recommended-implementation
      setTimeout(() => setIsModalVisible(true), 100);
    } else {
      // modal is about to be hidden
      setIsModalVisible(false);
    }
  }, [isVisible, isGlobalLoadingIndicatorVisible, isModalVisible]);

  return isModalVisible;
};
