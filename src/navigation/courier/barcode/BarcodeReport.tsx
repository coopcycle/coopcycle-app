import React from 'react';
import { withTranslation } from 'react-i18next';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Alert } from 'react-native';

function BarcodeReport({ route, t, navigation }) {
  const { entity } = route.params;
  return (
    <VStack space="md" className="p-4">
      <Text fontSize="lg" className="pb-2">
        {t('TASK')} #{entity?.id}
      </Text>
      <Button
        size="lg"
        onPress={
          // () => navigation.navigate('CourierUpdateParcel', { entity })
          () => Alert.alert(null, 'Not yet supported, coming soon!')
        }>
        <ButtonText>{t('UPDATE_PARCEL_DETAILS')}</ButtonText>
      </Button>
      <Button
        size="lg"
        onPress={() =>
          navigation.navigate('CourierReportIncident', { entity })
        }>
        <ButtonText>{t('REPORT_AN_INCIDENT')}</ButtonText>
      </Button>
    </VStack>
  );
}

export default withTranslation()(BarcodeReport);
