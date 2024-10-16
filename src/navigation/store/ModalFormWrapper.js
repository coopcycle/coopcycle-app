import { Box, Button, ScrollView, VStack } from 'native-base';
import { SafeAreaView } from 'react-native';
import { useBackgroundContainerColor } from '../../styles/theme';
import KeyboardAdjustView from '../../components/KeyboardAdjustView';

export default function ModalFormWrapper({
  children,
  handleSubmit,
  t,
  isSubmit = false,
}) {
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
        <KeyboardAdjustView style={{flex: 1}}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <Box p="5" gap="3">
              {children}
            </Box>
          </ScrollView>
          <Box p="5">
            <Button onPress={handleSubmit}>
              {isSubmit ? t('SUBMIT') : t('NEXT')}
            </Button>
          </Box>
        </KeyboardAdjustView>
      </VStack>
    </SafeAreaView>
  );
}
