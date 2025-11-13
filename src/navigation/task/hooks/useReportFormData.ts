// hooks/useReportFormData.ts
import { useReportForm } from '../contexts/ReportFormContext';

export const useReportFormData = () => {
  const { formState, updateFormField, updateFormState, getFormData } = useReportForm();

  return {
    formData: formState,
    
    setAddress: (address) => updateFormField('address', address),
    setPackagesCount: (packages: []) => updateFormField('packagesCount', packages),
    setSelectedTimeSlot: (timeSlot: string) => updateFormField('selectedTimeSlot', timeSlot),
    setSelectedChoice: (choice) => updateFormField('selectedChoice', choice),
    setSelectedSupplements: (supplements: []) => updateFormField('selectedSupplements', supplements),
    
    updateForm: updateFormState,
    getFormData,
  };
};