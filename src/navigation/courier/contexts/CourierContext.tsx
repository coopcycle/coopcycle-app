// contexts/CourierContext.js
import { ReactNode, createContext, useContext } from 'react';

export const CourierContext = createContext<CourierContextType>({
  isFromCourier: false,
});

export const useCourier = (): CourierContextType => {
  const context = useContext(CourierContext);
  return context;
};

const createCourierProvider = (isFromCourier: boolean): React.FC<CourierProviderProps> => {
    return ({children}: CourierProviderProps) => {
        const value: CourierContextType = {
            isFromCourier
        }
        return(
        <CourierContext.Provider value={value}>
        {children}
        </CourierContext.Provider>
        );
    }
} 

export const CourierProvider = createCourierProvider(true);
export const NonCourierProvider = createCourierProvider(false);

interface CourierProviderProps {
    children: ReactNode,
    isFromCourier: boolean,   
}

interface CourierContextType {
    isFromCourier: boolean
}