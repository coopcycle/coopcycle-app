import { EllipsisVertical } from 'lucide-react-native';
import { NavigationProp, useRoute } from '@react-navigation/native';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { cancelTask } from '@/src/redux/Courier/taskActions';
import { navigateToCompleteTask, navigateToReportTask } from '../utils';
import { startTask } from '@/src/redux/Courier';
import { useTaskListsContext } from '../courier/contexts/TaskListsContext';
import TasksMenu from '../components/TasksMenu';
import { useIconColor } from '@/src/styles/theme';

export const SelectedTasksMenu: React.FC<SelectedTasksMenuIProps> = ({
  navigation,
}) => {
  const { t } = useTranslation();
  const iconColor = useIconColor();
  const dispatch = useDispatch();
  const context = useTaskListsContext();
  const selectedTasks = context?.selectedTasksToEdit;
  const route = useRoute();
  const options = [
    {
      key: 'StartTask',
      text: t('START'),
      action: () => {
        selectedTasks?.forEach(t => {
          return dispatch(startTask(t, () => {}));
        });
        context?.clearSelectedTasks();
      },
    },
    {
      key: 'CompleteTask',
      text: t('COMPLETE_TASK'),
      action: () => {
        navigateToCompleteTask(navigation, route,  null, selectedTasks, true);
        context?.clearSelectedTasks();

      },
    },
    {
      key: 'CancelTask',
      text: t('CANCEL'),
      isDisabled: context?.isFromCourier,
      action: () => {
        if (!selectedTasks?.length) return;

        const isPlural = selectedTasks.length > 1;
        const entity = isPlural ? t('TASKS') : t('TASK');
        const name = isPlural
          ? `${selectedTasks.length} ${entity}`
          : String(selectedTasks?.[0]?.id || '');

        Alert.alert(
          t('CANCEL_TITLE', { entity }),
          t(isPlural ? 'CANCEL_MESSAGE_PLURAL' : 'CANCEL_MESSAGE', { entity, name, count: selectedTasks.length}),
          [
            { text: t('CANCEL'), style: 'cancel' },
            {
              text: t('PROCEED'),
              style: 'destructive',
              onPress: () => {
                try {
                  for (const task of selectedTasks) {
                    dispatch(cancelTask(task, () => {}));
                  }
                } catch (error) {
                  console.error('Cancel task/s error:', error);
                  Alert.alert(
                    t('CANCEL_ERROR_TITLE'),
                    t('CANCEL_ERROR_MESSAGE', { entity }),
                  );
                } finally {
                  context?.clearSelectedTasks();
                }
              },
            },
          ],
        );
      },
    },
    {
      key: 'ReportIncidence',
      text: t('REPORT_INCIDENT'),
      isDisabled: selectedTasks?.length > 1,
      action: () => {
        navigateToReportTask(navigation, route, selectedTasks[0], [], false);
        context?.clearSelectedTasks();
      },
    },
    {
      key: 'EditTask',
      text: t('EDIT'),
      isDisabled: true,
      action: () => {
        //TODO: Implement edit feature as described at https://github.com/coopcycle/coopcycle/issues/498
        console.log('EDIT TASK');
      },
    },
  ];

  return (
    <View>
      <TasksMenu
        options={options}
        renderTrigger={triggerProps => (
          <TouchableOpacity {...triggerProps} testID='selectedTasksToEditMenuButton'>
            <View style={styles.container}>
              <Text style={styles.counter}>
                {context?.selectedTasksToEdit.length}
              </Text>
              <EllipsisVertical color={iconColor} size={20} />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 10,
  },
  counter: {
    color: 'white',
    backgroundColor: '#666',
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    textAlign: 'center',
  },
});

interface SelectedTasksMenuIProps {
  navigation: NavigationProp<object>;
}
