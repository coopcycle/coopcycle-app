import { StyleSheet } from 'react-native';
import { Text } from '@/components/ui/text';

type Props = {
  message: string;
};

export function ErrorText({ message }: Props) {
  return <Text style={styles.error}>{message}</Text>;
}

const styles = StyleSheet.create({
  error: {
    color: '#FF4136',
  },
});
