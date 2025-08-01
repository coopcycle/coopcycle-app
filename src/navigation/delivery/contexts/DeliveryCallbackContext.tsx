import React, { createContext, useContext } from 'react';

const DeliveryCallbackContext = createContext();

export const DeliveryCallbackProvider = ({ children, callback }) => (
  <DeliveryCallbackContext.Provider
    value={{
      deliveryCallback: callback,
    }}>
    {children}
  </DeliveryCallbackContext.Provider>
);

export const useDeliveryCallback = () => {
  const context = useContext(DeliveryCallbackContext);
  if (!context) {
    throw new Error(
      'useDeliveryCallback must be used within a DeliveryCallbackContext',
    );
  }
  return context;
};
