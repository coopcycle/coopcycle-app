import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import i18n from '@/src/i18n';
import Task from '@/src/types/task';
import { StyleSheet } from 'react-native';
import { Counter } from './Counter';

const styles = StyleSheet.create({
  counterButton: {
    backgroundColor: '#C6C7C7'
  },
  rowButton: {
    alignItems: 'center',
    marginVertical: 8,
  },
  counterText: {
    marginHorizontal: 8
  },
  packageName: {
    marginLeft: 8
  }
})

export const EditPackages: React.FC<{ task: Task }> = ({ task }) => {
  const t = i18n.t;

  return (
    <>
      <Text>{t('STORE_NEW_DELIVERY_PACKAGES')}</Text>
      {task?.packages?.map((p) => {
        return (
          <HStack style={styles.rowButton}>
            <Counter item={p} />
          </HStack>
        );
      })}
    </>
  );
};
