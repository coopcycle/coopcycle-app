import { useEffect, useState } from 'react';
import { Package } from '@/src/redux/api/types';
import { useFormikContext } from 'formik';
import {
  BasePackagesFields,
  PackageWithQuantity,
} from '@/src/navigation/delivery/utils';

export function usePackagesCount(packages?: Package[]) {
  const { setFieldTouched, setFieldValue } =
    useFormikContext<BasePackagesFields>();

  const [packagesCount, setPackagesCount] = useState(
    [] as PackageWithQuantity[],
  );

  // set initial value
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

  // update value in the formik form
  useEffect(() => {
    setFieldValue('packages', packagesCount);
  }, [packagesCount, setFieldValue]);

  function incrementQuantity(packageType: string) {
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

  function decrementQuantity(packageType: string) {
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
