import { useEffect, useState } from 'react';

export function useTimeSlotChoice(timeSlotChoices: []) {
  const [selectedChoice, setSelectedChoice] = useState(null);

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