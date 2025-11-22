// hooks/useTaskSubmit.ts
import { useCallback } from 'react';
import { Task } from '@/src/types/task';

// useTaskSubmit handles a single object that contains 
// all changes from Report Screen (including task modified fields and report incident)
// and calls onSubmit with that object.

export const useReportFormSubmit = ({ onSubmit }) => {
  const handleFormSubmit = useCallback((
    values,

    address,
    store,
    packagesCount: [],
    selectedTimeSlot: string,
    selectedChoice,
    country,
    task?: Partial<Task>,
    selectedSupplements: [] = []
  ) => {
    // Aquí va la lógica original de handleFormSubmit
    // que estaba en tu utils/taskFormHelpers
    
    console.log('Submitting form with values:', values);
    
    // Construir los datos a enviar
    const submitData: Partial<Task> = {
      ...values,
      address,
      store: store?.id || store?.['@id'],
      packages: packagesCount,
      timeSlot: selectedTimeSlot,
      supplements: selectedSupplements,
      // ... otra lógica de transformación
    };

    // Filtrar datos undefined/null si es necesario
    const filteredData = Object.fromEntries(
      Object.entries(submitData).filter(([_, value]) => value != null)
    );

    onSubmit(filteredData);
  }, [onSubmit]);

  return {
    handleFormSubmit
  };
};