import {
  useGetTimeSlotChoicesQuery,
  useGetTimeSlotsQuery,
} from '@/src/redux/api/slice';
import { useEffect, useState } from 'react';
import { Store, TimeSlot, TimeSlotChoices } from '@/src/redux/api/types';

export const useTimeSlot = (store: Store) => {
  const [timeSlots, setTimeSlots] = useState(undefined as TimeSlot[] | undefined);

  const { data: backendTimeSlots } = useGetTimeSlotsQuery(store?.timeSlot, {
    skip: !store?.timeSlot,
  });

  useEffect(() => {
    if (backendTimeSlots) {
      const tss = backendTimeSlots.filter(ts => {
        if (store.timeSlots.includes(ts['@id'])) {
          return ts;
        }
      });
      setTimeSlots(tss);
    }
  }, [backendTimeSlots, store?.timeSlots]);

  return timeSlots || [];
};

export const useTimeSlotChoices = (store: Store) => {
  const [timeSlotChoices, setTimeSlotChoices] = useState(undefined as TimeSlotChoices | undefined);

  const { data } = useGetTimeSlotChoicesQuery(store?.timeSlot, {
    skip: !store?.timeSlot,
  });

  useEffect(() => {
    if (data) {
      setTimeSlotChoices(data);
    }
  }, [data]);

  return timeSlotChoices?.choices || [];
};
