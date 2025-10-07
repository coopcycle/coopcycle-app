import { useCallback } from 'react';
import { Task } from '../../../types/task';

export const useAllowTaskSelection = () => {
  return useCallback((task: Task) => {
    return task.status !== 'DONE';
  }, []);
};
