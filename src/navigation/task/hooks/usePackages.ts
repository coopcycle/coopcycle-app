import { useEffect, useState } from 'react';
import { Task } from '@/src/types/task';
import { useGetStorePackagesQuery } from '@/src/redux/api/slice';

export const usePackages = (task?: Partial<Task>, store?) => {
  const [storePackages, setStorePackages] = useState<[]>([]);

  const { data } = useGetStorePackagesQuery(store?.['@id'], {
    skip: !store?.['@id']
  });

  useEffect(() => {
    const initial = task?.packages || [];
    const api = data || [];

    const merged = mergePackages(initial, api);
    console.log(api)
    setStorePackages(merged);
  }, [task?.packages, data]);

  return {
    storePackages,
  };
};

const mergePackages = (initialPackages: [] = [], packages: [] = []) => {
  if (!packages.length) {
    return initialPackages;
  }
  return packages.map(pkg => {
    const initialPkg = initialPackages?.find(p => p.name === pkg.name);
    return {
      ...pkg,
      quantity: initialPkg ? initialPkg.quantity : 0,
    };
  });
};