import Task from '@/src/types/task';
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';
import { buildUpdatedTaskFields } from '../utils/taskFormHelpers';

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
  packagesCount: Package[];
  selectedTimeSlot: string;
  selectedChoice: string | null;
  selectedSupplements: Supplement[];
  // REPORT INCIDENT FIELDS
  failureReason?: string;
  failureReasonMetadata: Record<string, unknown>;
  notes: string;
  task: Task;
}

interface ReportFormContextType {
  formState: FormState;
  formStateToSend: {
    failureReason: string;
    description: string;
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
    description: '',
    updatedTask: {},
    taskID: initialTask?.['@id'] || '',
  });
  const [formState, setFormState] = useState<FormState>({
    values: null,
    telephone: initialTask?.address?.telephone || '',
    weight: initialTask?.weight ? initialTask.weight.toString() : '0',
    address: initialTask?.address ?? null,
    packagesCount: initialTask?.packages ?? [],
    selectedTimeSlot: initialTask?.timeSlot ?? '',
    selectedChoice: null,
    selectedSupplements: [],
    // REPORT INCIDENT FIELDS
    failureReason: '',
    failureReasonMetadata: {},
    notes: '',
    task: initialTask,
  });

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
          updates.description = value as string ?? '';
          break;
        case 'failureReason':
          updates.failureReasonCode = value as string ?? '';
          break;
        case 'address':
        case 'weight':
        case 'telephone':
        case 'packagesCount':
        case 'selectedTimeSlot':
        case 'selectedChoice':
        case 'selectedSupplements':
          updates.updatedTask = {
            ...buildUpdatedTaskFields(field, value),
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
      packagesCount: initialTask?.packages ?? [],
      selectedTimeSlot: initialTask?.timeSlot ?? '',
      selectedChoice: null,
      selectedSupplements: [],
    });
  }, [initialTask]);

  const value: ReportFormContextType = {
    formState,
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
