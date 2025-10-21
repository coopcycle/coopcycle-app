import { ElementType, ReactNode } from 'react';
import { View, useColorScheme } from 'react-native';

type ModalContentProps = {
  children?: ReactNode;
  as?: ElementType;
};

export default function ModalContent({ children, as: Component = View }: ModalContentProps) {
  const colorScheme = useColorScheme();

  return (
    <Component style={{ backgroundColor: colorScheme === 'dark' ? 'black' : 'white' }}>
      {children}
    </Component>
  );
}
