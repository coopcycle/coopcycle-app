import { ReactNode, createContext, useContext } from 'react';

export const CourierContext = createContext<CourierContextType | undefined>(undefined);

export const useCourier = (): CourierContextType | undefined => {
  return useContext(CourierContext);
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
