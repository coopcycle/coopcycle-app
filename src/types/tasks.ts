// ====== TASKS COLLECTION TYPES ======

import { Task } from './task';

/**
 * Tasks array type - represents a collection of Task objects
 */
export type Tasks = Task[];

/**
 * Tasks component props interface
 * Useful for components that receive a list of tasks
 */
export interface TasksProps {
  tasks: Tasks;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onTaskPress?: (task: Task) => void;
}

/**
 * Tasks state interface for Redux/state management
 */
export interface TasksState {
  items: Tasks;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  totalCount: number;
}

export default Tasks;
