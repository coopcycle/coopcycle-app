import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { loadTimeSlotChoices } from '@/src/redux/Delivery/actions';
import { Store, TimeSlot, Uri } from '@/src/redux/api/types';

export function useDeliveryTimeSlot(store: Store, timeSlots: TimeSlot[]) {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(undefined as Uri | undefined);
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

  function updateSelectedTimeSlot(timeSlot: TimeSlot) {
    setSelectedTimeSlot(timeSlot['@id']);
  }

  return {
    selectedTimeSlot,
    setSelectedTimeSlot,
    updateSelectedTimeSlot,
  };
}
