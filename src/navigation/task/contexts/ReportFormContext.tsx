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
import { Uri } from '@/src/redux/api/types';

interface Supplement {
  id: number;
  name: string;
}

interface FormState {
  // EDIT TASK FIELDS
  values: Record<string, unknown> | null;
  address: string | null;
  telephone?: string;
  selectedSupplements: Supplement[];
  // REPORT INCIDENT FIELDS
  failureReason?: string;
  notes: string;
  task: Task;
}

export interface FormStateToSend {
  failureReason: string;
  notes: string;
  task: Task;
  updatedTask: Record<string, unknown>;
  taskID: Uri;
}

interface ReportFormContextType {
  formState: FormState;
  isSubmitting: boolean;
  startSubmitting: () => void;
  stopSubmitting: () => void;
  formStateToSend: FormStateToSend;
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
  } as FormStateToSend);

  const [formState, setFormState] = useState<FormState>({
    values: null,
    telephone: initialTask?.address?.telephone || '',
    address: initialTask?.address ?? null,
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
      const updates = {} as Partial<FormStateToSend>;

      let updatedTask = { ...prev.updatedTask };

      switch (field) {
        case 'failureReason':
        updates.failureReason = (value as string) ?? '';
          break;
        case 'notes':
          updates.notes = (value as string) ?? '';
          break;
        case 'selectedSupplements':
          //FIXME: move supplements outside of task
          const supplementUpdates = {
            selectedSupplements: mapSupplements(value),
          };
          updatedTask = {
            ...updatedTask,
            ...supplementUpdates
          };
          updates.updatedTask = updatedTask;
          break;
        default:
          const taskUpdates = { ...buildUpdatedTaskFields(field, value) };
          updatedTask = {
            ...updatedTask,
            ...taskUpdates
          };
          updates.updatedTask = updatedTask;
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
  return context;
};
