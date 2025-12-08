import {
  useGetTimeSlotsQuery,
} from '@/src/redux/api/slice';
import { useEffect, useState } from 'react';
import { Store, TimeSlot } from '@/src/redux/api/types';

//FIXME: use `${store['@id']}/time_slots`
export const useTimeSlot = (store: Store) => {
  const [timeSlots, setTimeSlots] = useState(undefined as TimeSlot[] | undefined);

  const { data: backendTimeSlots } = useGetTimeSlotsQuery(undefined, {
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
