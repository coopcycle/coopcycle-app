import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AsYouType } from 'libphonenumber-js';
import { assertDelivery } from '@/src/redux/Delivery/actions';
import i18n from '@/src/i18n';

export const useFormUtils = (store) => {
  const { t } = i18n;
  const country = useSelector((state) => state.app.settings.country.toUpperCase());
  const dispatch = useDispatch();

const setAddressData = useCallback((data: any, setFieldValue: any) => {
  const {
    contactName = '',
    telephone = '',
    name: businessName = '',
    description = '',
    streetAddress,
    geo,
  } = data;

  setFieldValue('contactName', contactName);
  setFieldValue('telephone', telephone);
  setFieldValue('businessName', businessName);
  setFieldValue('description', description);

  return { streetAddress, geo };
}, []);

  const onSelectAddress = useCallback(
    (addr, setFieldValue, setAddress, setValidAddress) => {
      const newAddress = addr['@id'] 
        ? addr 
        : { streetAddress: addr.streetAddress, geo: addr.geo };

      setAddress(newAddress);

      const delivery = {
        store: store?.['@id'],
        dropoff: {
          address: addr,
          before: 'tomorrow 12:00',
        },
      };

      dispatch(assertDelivery(delivery, () => setValidAddress(true)));
    },
    [store, dispatch],
  );

  const handleChangeTelephone = useCallback(
    (value: string, setFieldValue, setFieldTouched) => {
      setFieldValue('telephone', new AsYouType(country).input(value));
      setFieldTouched('telephone', true);
    },
    [country],
  );

  const handleChangeWeight = useCallback(
    (value: string, setFieldValue, setFieldTouched) => {
      setFieldValue('weight', value.replace(/[^0-9.]/g, ''));
      setFieldTouched('weight', true);
    },
    [],
  );

  return {
    t,
    country,
    setAddressData,
    onSelectAddress,
    handleChangeTelephone,
    handleChangeWeight,
  };
};