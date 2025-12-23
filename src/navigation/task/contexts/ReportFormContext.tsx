import Task from '@/src/types/task';
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';
import { FailureReasonMetadata, Uri } from '@/src/redux/api/types';

export interface FormState {
  // REPORT INCIDENT FIELDS
  failureReason: string;
  initialFailureReasonMetadata: FailureReasonMetadata[];
  failureReasonMetadataToSend: { [key: string]: unknown };
  notes: string;
  task: Task;
  taskID: Uri;
}

interface ReportFormContextType {
  formState: FormState;
  isSubmitting: boolean;
  startSubmitting: () => void;
  stopSubmitting: () => void;
  updateFormField: <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => void;
  getFormData: () => FormState;
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
  const [formState, setFormState] = useState<FormState>({
    // REPORT INCIDENT FIELDS
    failureReason: '',
    initialFailureReasonMetadata: [],
    failureReasonMetadataToSend: {},
    notes: '',
    task: initialTask,
    taskID: initialTask?.['@id'] || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const startSubmitting = useCallback(() => {
    setIsSubmitting(true);
  }, []);

  const stopSubmitting = useCallback(() => {
    setIsSubmitting(false);
  }, []);


  const updateFormField = useCallback(function <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) {
    setFormState(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const getFormData = useCallback(() => formState, [formState]);

  const value: ReportFormContextType = {
    formState,
    isSubmitting,
    startSubmitting,
    stopSubmitting,
    updateFormField,
    getFormData,
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
