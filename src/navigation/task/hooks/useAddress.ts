import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { assertDelivery } from '@/src/redux/Delivery/actions';
import { selectStore } from '@/src/redux/Delivery/selectors';
import { Task } from '@/src/types/task';

export interface AddressData {
  streetAddress?: string;
  geo?;
  contactName?: string;
  telephone?: string;
  name?: string;
  description?: string;
  '@id'?: string;
}

export const useAddress = (task?: Partial<Task>) => {
  const [validAddress, setValidAddress] = useState(!!task?.address?.streetAddress);
  const [address, setAddress] = useState<AddressData | null>(null);
  
  const dispatch = useDispatch();
  const store = useSelector(selectStore);

  useEffect(() => {
    if (task?.address) {
      const taskAddress: AddressData = {
        streetAddress: task.address.streetAddress,
        geo: task.address.geo,
        contactName: task.address.contactName,
        telephone: task.address.telephone,
        name: task.address.name,
        description: task.address.description,
      };
      setAddress(taskAddress);
      
      if (store && taskAddress.streetAddress) {
        const delivery = {
          store: store['@id'] || null,
          dropoff: {
            address: taskAddress,
            before: task?.before || 'tomorrow 12:00',
          },
        };
        dispatch(assertDelivery(delivery, () => setValidAddress(true)));
      }
    }
  }, [task, store, dispatch]);

  return { 
    validAddress, 
    setValidAddress, 
    address, 
    setAddress 
  };
};