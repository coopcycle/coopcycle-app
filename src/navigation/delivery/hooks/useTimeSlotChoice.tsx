import { useEffect, useState } from 'react';
import { TimeSlotChoice } from '@/src/redux/api/types';

export function useTimeSlotChoice(timeSlotChoices: TimeSlotChoice[]) {
  const [selectedChoice, setSelectedChoice] = useState(null as string | null);

  useEffect(() => {
    if (timeSlotChoices.length) {
      setSelectedChoice(timeSlotChoices[0].value);
    }
  }, [timeSlotChoices]);

  return {
    selectedChoice,
    setSelectedChoice,
  };
}