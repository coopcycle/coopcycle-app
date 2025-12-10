import { useEffect, useState } from 'react';
import { Task, TaskPackage } from '@/src/types/task';
import { useGetStorePackagesQuery } from '@/src/redux/api/slice';
import { Store, StorePackage } from '@/src/redux/api/types';
import { PackageWithQuantity } from '@/src/navigation/delivery/utils';

export const usePackages = (task?: Task, store?: Store) => {
  const [packagesWithQuantity, setPackagesWithQuantity] = useState<
    PackageWithQuantity[] | undefined
  >(undefined);

  const [canEditPackages, setCanEditPackages] = useState(true);

  const { data: storePackages } = useGetStorePackagesQuery(store?.['@id'], {
    skip: !store?.['@id'],
  });

  useEffect(() => {
    // wait for storePackages to be loaded
    if (!storePackages) return;

    const initial = task?.packages || [];
    const merged = mergePackages(initial, storePackages ?? []);

    setPackagesWithQuantity(merged);

    if (task) {
      //don't allow to edit packages if there is at least one package linked to another task
      const canEditPackages =
        initial.filter(item => !item.tasks?.includes(task['@id'])).length === 0;
      setCanEditPackages(canEditPackages);
    }
  }, [task, storePackages]);

  return {
    storePackages,
    packagesWithQuantity,
    canEditPackages,
  };
};

const mergePackages = (
  initialPackages: TaskPackage[] = [],
  packages: StorePackage[] = [],
): PackageWithQuantity[] => {
  if (!packages.length) {
    return initialPackages;
  }
  return packages.map(pkg => {
    const initialPkg = initialPackages?.find(p => p.name === pkg.name);
    return {
      type: pkg.name,
      quantity: initialPkg ? initialPkg.quantity : 0,
    };
  });
};
