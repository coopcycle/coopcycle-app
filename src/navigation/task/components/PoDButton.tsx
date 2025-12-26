import { Text } from '@/components/ui/text';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button } from '@/components/ui/button';
import { navigateToProofOfDeliveryFromReportIncident } from '../../utils';
import { useTranslation } from 'react-i18next';

export const PoDButton = ({ task, tasks, success }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useTranslation();

  return (
    <Button
      style={{ backgroundColor: '#BB4711' }}
      onPress={() =>
        navigateToProofOfDeliveryFromReportIncident(
          navigation,
          route,
          task,
          tasks,
          success,
        )
      }
    >
      <Text style={{ color: 'white' }}>{t('TASK_ADD_PROOF_OF_DELIVERY')}</Text>
    </Button>
  );
};
