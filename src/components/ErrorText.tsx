import { Text } from '@/components/ui/text';

type Props = {
  message: string;
};

export function ErrorText({ message }: Props) {
  return <Text className="text-error-400">{message}</Text>;
}
