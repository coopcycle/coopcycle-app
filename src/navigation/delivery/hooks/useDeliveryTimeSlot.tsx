import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { loadTimeSlotChoices } from '@/src/redux/Delivery/actions';

export function useDeliveryTimeSlot(store: object, timeSlots: []) {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedTimeSlot) return;
    if (store.timeSlot && store.timeSlot.trim() !== '') {
      setSelectedTimeSlot(store.timeSlot);
    } else if (timeSlots.length > 0) {
      setSelectedTimeSlot(timeSlots[0]['@id']);
    }
  }, [store.timeSlot, timeSlots, selectedTimeSlot]);

  useEffect(() => {
    if (!selectedTimeSlot || !timeSlots.length) return;
    dispatch(
      loadTimeSlotChoices(timeSlots.find(ts => ts['@id'] === selectedTimeSlot)),
    );
  }, [selectedTimeSlot, timeSlots, dispatch]);

  function updateSelectedTimeSlot(timeSlot) {
    setSelectedTimeSlot(timeSlot['@id']);
  }

  return {
    selectedTimeSlot,
    setSelectedTimeSlot,
    updateSelectedTimeSlot,
  };
}