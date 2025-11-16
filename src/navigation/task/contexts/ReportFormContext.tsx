import Task from '@/src/types/task';
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';
import {
  buildUpdatedTaskFields,
  mapSupplements,
} from '../utils/taskFormHelpers';

interface Package {
  id: number;
  weight?: number;
  description?: string;
}

interface Supplement {
  id: number;
  name: string;
}

interface FormState {
  // EDIT TASK FIELDS
  values: Record<string, unknown> | null;
  address: string | null;
  telephone?: string;
  packages: Package[];
  selectedTimeSlot: string;
  selectedChoice: string | null;
  selectedSupplements: Supplement[];
  // REPORT INCIDENT FIELDS
  failureReason?: string;
  notes: string;
  task: Task;
}

interface ReportFormContextType {
  formState: FormState;
  isSubmitting: boolean;
  startSubmitting: () => void;
  stopSubmitting: () => void;
  formStateToSend: {
    failureReason: string;
    notes: string;
    updatedTask: Record<string, unknown>;
    taskID: string;
  };
  updateFormState: (updates: Partial<FormState>) => void;
  updateFormField: <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => void;
  getFormData: () => FormState;
  resetForm: () => void;
}

const ReportFormContext = createContext<ReportFormContextType | undefined>(
  undefined,
);

interface ReportFormProviderProps {
  children: ReactNode;
  initialTask?: Task;
}

export const ReportFormProvider: React.FC<ReportFormProviderProps> = ({
  children,
  initialTask,
}) => {
  const [formStateToSend, setFormStateToSend] = useState({
    failureReason: '',
    notes: '',
    task: initialTask || {},
    updatedTask: {},
    taskID: initialTask?.['@id'] || '',
  });
  const [formState, setFormState] = useState<FormState>({
    values: null,
    telephone: initialTask?.address?.telephone || '',
    weight: initialTask?.weight ? initialTask.weight.toString() : '0',
    address: initialTask?.address ?? null,
    packages: [],
    selectedTimeSlot: initialTask?.timeSlot ?? '',
    selectedChoice: null,
    selectedSupplements: [],
    // REPORT INCIDENT FIELDS
    failureReason: '',
    failureReasonMetadata: {},
    notes: '',
    task: initialTask,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const startSubmitting = useCallback(() => {
    setIsSubmitting(true);
  }, []);

  const stopSubmitting = useCallback(() => {
    setIsSubmitting(false);
  }, []);


  const updateFormState = useCallback((updates: Partial<FormState>) => {
    setFormState(prev => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const updateFormField = useCallback(function <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) {
    setFormState(prev => ({
      ...prev,
      [field]: value,
    }));

    setFormStateToSend(prev => {
      const updates = {};

      switch (field) {
        case 'notes':
          updates.notes = (value as string) ?? '';
          break;
        case 'failureReasonCode':
          updates.failureReasonCode = (value as string) ?? '';
          break;
        case 'weight':
        case 'address':
        case 'telephone':
        case 'packages':
        case 'selectedTimeSlot':
        case 'selectedChoice':
        case 'description':
          updates.updatedTask = {
            tasks: { ...buildUpdatedTaskFields(field, value) },
          };
          break;
        case 'selectedSupplements':
          updates.updatedTask = {
            selectedSupplements: mapSupplements(value),
          };
          break;
        default:
          break;
      }

      return {
        ...prev,
        ...updates,
      };
    });
  }, []);

  const getFormData = useCallback(() => formState, [formState]);

  const resetForm = useCallback(() => {
    setFormState({
      values: null,
      address: initialTask?.address ?? null,
      packages: initialTask?.packages ?? [],
      selectedTimeSlot: initialTask?.timeSlot ?? '',
      selectedChoice: null,
      selectedSupplements: [],
    });
  }, [initialTask]);

  const value: ReportFormContextType = {
    formState,
    isSubmitting,
    startSubmitting,
    stopSubmitting,
    formStateToSend,
    updateFormState,
    updateFormField,
    getFormData,
    resetForm,
  };

  return (
    <ReportFormContext.Provider value={value}>
      {children}
    </ReportFormContext.Provider>
  );
};

export const useReportFormContext = (): ReportFormContextType => {
  const context = useContext(ReportFormContext);
  if (!context) {
    throw new Error('useReportForm must be used within a ReportFormProvider');
  }
  return context;
};
