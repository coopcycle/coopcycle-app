import { Box, Button, VStack } from 'native-base';
import { SafeAreaView } from 'react-native';
import { useBackgroundContainerColor } from '../../styles/theme';

export default function ModalFormWrapper({ children, handleSubmit, t }) {
  const backgroundColor = useBackgroundContainerColor();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor,
      }}>
      <VStack
        flex={1}
        justifyContent="space-between"
        style={{
          backgroundColor,
        }}>
        <Box p="5" gap="3">
          {children}
        </Box>
        <Box p="5">
          <Button onPress={handleSubmit}>{t('SUBMIT')}</Button>
        </Box>
      </VStack>
    </SafeAreaView>
  );
}