import { useEffect, useState } from 'react';
import { useGetStoresQuery } from '@/src/redux/api/slice';
import { Task } from '@/src/types/task';

export const useStore = (task?: Partial<Task>) => {
  const [store, setStore] = useState(null);
  const { data: backendStores } = useGetStoresQuery();

  useEffect(() => {
    if (backendStores && task?.orgName) {
      const matchedStore = backendStores.find(store => 
        store.name === task.orgName || 
        store.name?.toLowerCase() === task.orgName?.toLowerCase()
      );
      setStore(matchedStore || null);
    }
  }, [backendStores, task?.orgName]);

  return store;
};