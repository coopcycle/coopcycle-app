import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  counterButton: {
    backgroundColor: '#C6C7C7',
  },
  rowButton: {
    alignItems: 'center',
    marginVertical: 8,
  },
  counterText: {
    marginHorizontal: 8,
  },
  packageName: {
    marginLeft: 8,
  },
});

export const Counter: React.FC<{
  item: { name: string; quantity: number | string };
}> = ({ item }) => {
  return (
    <>
      <Button size={'xs'} style={styles.counterButton}>
        <ButtonText>{'-'}</ButtonText>
      </Button>
      <Text style={styles.counterText}>{item.quantity}</Text>
      <Button size={'xs'} style={styles.counterButton}>
        <ButtonText>{'+'}</ButtonText>
      </Button>
      <Text style={styles.packageName}>{item.name}</Text>
    </>
  );
};
