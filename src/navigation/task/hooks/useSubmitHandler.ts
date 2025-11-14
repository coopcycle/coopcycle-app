import { useCallback } from 'react';

export function useHandleSubmit({ formState, updateFormState }) {
  const handleSubmit = useCallback(
    (values: Record<string, unknown>) => {
      console.log('Current form state:', formState);
      console.log('Submitting form with values:', values);
      updateFormState({
        ...formState,
        values,
        address: formState.address,
        packagesCount: formState.packagesCount,
        selectedTimeSlot: formState.selectedTimeSlot,
        selectedChoice: formState.selectedChoice,
        selectedSupplements: formState.selectedSupplements,
      });
      // handleFormSubmit(
      //   values,
      //   address,
      //   store,
      //   packagesCount,
      //   selectedTimeSlot,
      //   selectedChoice,
      //   country,
      //   task,
      //   onSubmit,
      //   selectedSupplements,
      // );
    },
    [formState, updateFormState],
  );

  return handleSubmit;
}
