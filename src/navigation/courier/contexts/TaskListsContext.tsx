import { FC, ReactNode, createContext, useContext, useState } from 'react';
import Task from '@/src/types/task';

interface TaskListsContextType {
  selectedTasksToEdit: Task[];
  isEditMode: boolean;
  isFromCourier: boolean;
  setSelectedTasksToEdit: (tasks: Task[]) => void;
  setIsEditMode: (isEditMode: boolean) => void;
  setIsFromCourier: (isFromCourier: boolean) => void;
}

interface TaskListsProviderProps {
  children: ReactNode;
}

const TaskListsContext = createContext<TaskListsContextType | undefined>(undefined);

export const useTaskListsContext = (): TaskListsContextType | undefined => {
    return useContext(TaskListsContext);
};

export const TaskListsProvider: FC<TaskListsProviderProps> = ({ children }) => {
  const [selectedTasksToEdit, setSelectedTasksToEdit] = useState<Task[]>([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isFromCourier, setIsFromCourier] = useState<boolean>(true);

  const value: TaskListsContextType = {
    selectedTasksToEdit,
    isEditMode,
    isFromCourier,
    setSelectedTasksToEdit,
    setIsEditMode,
    setIsFromCourier,
  };

  return (
    <TaskListsContext.Provider value={value}>
      {children}
    </TaskListsContext.Provider>
  );
};