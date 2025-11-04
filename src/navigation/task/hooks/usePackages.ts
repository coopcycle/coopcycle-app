import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectPackages } from '@/src/redux/Delivery/selectors';
import { Task } from '@/src/types/task';

export const usePackages = (task?: Partial<Task>) => {
  const [packagesCount, setPackagesCount] = useState<[]>([]);
  const packages = useSelector(selectPackages);

  useEffect(() => {
    if (task?.packages && packages?.length) {
      const initialPackages = packages.map(pkg => {
        const taskPackage = task.packages.find(taskPkg => taskPkg.type === pkg.name);
        return {
          type: pkg.name || pkg.type,
          quantity: taskPackage?.quantity || 0,
          ...taskPackage
        };
      });
      setPackagesCount(initialPackages);
    } else if (task?.packages && !packages?.length) {
      // Si no hay paquetes en Redux pero sí en la task, usar los de la task
      const taskPackages = task.packages.map(pkg => ({
        type: pkg.type,
        quantity: pkg.quantity,
        ...pkg
      }));
      setPackagesCount(taskPackages);
    }
  }, [task?.packages, packages]);

  return { 
    packagesCount, 
    setPackagesCount 
  };
};