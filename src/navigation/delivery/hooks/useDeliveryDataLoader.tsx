import { useEffect } from 'react';
import { InteractionManager, Platform } from 'react-native';
import KeyboardManager from 'react-native-keyboard-manager';
import { useDispatch } from 'react-redux';
import { loadTimeSlot, loadTimeSlots } from '@/src/redux/Delivery/actions';

export function useDeliveryDataLoader(store) {
  const dispatch = useDispatch();

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      dispatch(loadTimeSlots(store));
      dispatch(loadTimeSlot(store));
    });

    if (Platform.OS === 'ios') {
      KeyboardManager.setEnable(true);
      KeyboardManager.setEnableAutoToolbar(true);
    }

    return () => {
      if (Platform.OS === 'ios') {
        KeyboardManager.setEnable(false);
        KeyboardManager.setEnableAutoToolbar(false);
      }
    };
  }, [store, dispatch]);
}
