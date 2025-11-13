import {
  useGetTimeSlotChoicesQuery,
  useGetTimeSlotsQuery,
} from '@/src/redux/api/slice';
import { useEffect, useState } from 'react';

export const useTimeSlot = store => {
  const [timeSlots, setTimeSlots] = useState(null);

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

  return timeSlots;
};

export const useTimeSlotChoices = store => {
  const [timeSlotChoices, setTimeSlotChoices] = useState([]);

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
