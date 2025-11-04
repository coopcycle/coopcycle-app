import { useEffect, useState } from 'react';

export function usePackagesCount(packages: []) {
  const [packagesCount, setPackagesCount] = useState([]);

  useEffect(() => {
    if (!packages) return;
    setPackagesCount(
      packages.map(item => {
        return {
          type: item.name,
          quantity: 0,
        };
      }),
    );
  }, [packages]);

  function incrementQuantity(packageType, setFieldTouched) {
    setFieldTouched('packages');
    setPackagesCount(prev => {
      return prev.map(item => {
        if (item.type === packageType) {
          item.quantity += 1;
        }
        return item;
      });
    });
  }

  function decrementQuantity(packageType, setFieldTouched) {
    setFieldTouched('packages');
    setPackagesCount(prev => {
      return prev.map(item => {
        if (item.type === packageType) {
          item.quantity -= 1;
        }
        return item;
      });
    });
  }

  return {
    packagesCount,
    setPackagesCount,
    incrementQuantity,
    decrementQuantity,
  };
}