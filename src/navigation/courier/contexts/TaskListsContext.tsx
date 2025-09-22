import { FC, ReactNode, createContext, useContext, useEffect, useState } from 'react';
import Task from '@/src/types/task';
import { useIsFocused } from '@react-navigation/native';

interface TaskListsContextType {
  selectedTasksToEdit: Task[];
  isEditMode: boolean;
  isFromCourier: boolean;
  setSelectedTasksToEdit: (tasks: Task[]) => void;
  setIsEditMode: (isEditMode: boolean) => void;
  setIsFromCourier: (isFromCourier: boolean) => void;
  toggleTaskSelection: (task: Task) => void;
  clearSelectedTasks: (task: Task) => void;
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
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      setSelectedTasksToEdit([]);
      setIsEditMode(false);
    }
  }, [isFocused]);

  const toggleTaskSelection = (task: Task) => {
    setSelectedTasksToEdit(prev => {
      const exists = prev.some(t => t['@id'] === task['@id']);
      let tasks;
      if (exists) {
        tasks = prev.filter(t => t['@id'] !== task['@id']);
      } else {
        tasks = [...prev, task];
      }
      setIsEditMode(tasks.length > 0);
      return tasks;
    });
  };

  const clearSelectedTasks = () => {
    setSelectedTasksToEdit([]);
  };

  const value: TaskListsContextType = {
    selectedTasksToEdit,
    isEditMode,
    isFromCourier,
    setSelectedTasksToEdit,
    setIsEditMode,
    setIsFromCourier,
    toggleTaskSelection,
    clearSelectedTasks,
  };

  return (
    <TaskListsContext.Provider value={value}>
      {children}
    </TaskListsContext.Provider>
  );
};