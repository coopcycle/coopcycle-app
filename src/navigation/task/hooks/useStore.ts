import { useEffect, useState } from 'react';
import { useGetStoresQuery } from '@/src/redux/api/slice';
import { Task } from '@/src/types/task';

export const useStore = (task?: Partial<Task>) => {
  const [store, setStore] = useState(null);
  const { data: backendStores, isLoading, error } = useGetStoresQuery();

  useEffect(() => {
    if (backendStores && task?.orgName) {
      const matchedStore = backendStores.find(store => 
        store.name?.toLowerCase() === task.orgName?.toLowerCase() ||
        store.name?.includes(task.orgName || '') ||
        task.orgName?.includes(store.name || '')
      );
      
      setStore(matchedStore || null);
    } else if (backendStores && backendStores.length > 0 && !task?.orgName) {
      setStore(backendStores[0]);
    }
  }, [backendStores, task?.orgName]);

  return store;
};