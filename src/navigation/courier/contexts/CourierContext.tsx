// contexts/CourierContext.js
import { ReactNode, createContext, useContext } from 'react';

export const CourierContext = createContext<CourierContextType>({
  // We assume this context will always be used only from courier screens
  isFromCourier: true,
});

export const useCourier = (): CourierContextType => {
  const context = useContext(CourierContext);
  return context;
};

const createCourierProvider = (): React.FC<CourierProviderProps> => {
    return ({children}: CourierProviderProps) => {
        const value: CourierContextType = {
            isFromCourier: true
        }
        return(
        <CourierContext.Provider value={value}>
        {children}
        </CourierContext.Provider>
        );
    }
}

export const CourierProvider = createCourierProvider();

interface CourierProviderProps {
    children: ReactNode,
    isFromCourier?: boolean,
}

interface CourierContextType {
    isFromCourier: boolean,
}
