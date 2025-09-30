import { EllipsisVertical } from 'lucide-react-native';
import { NavigationProp, useRoute } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { cancelTask } from '@/src/redux/Courier/taskActions';
import { navigateToCompleteTask } from '../utils';
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
      key: 'Start Task',
      text: t('START'),
      action: () => {
        selectedTasks?.forEach(t => {
          return dispatch(startTask(t, () => {}));
        });
        context?.clearSelectedTasks();
      },
    },
    {
      key: 'Complete Task',
      text: t('COMPLETE_TASK'),
      action: () => {
        navigateToCompleteTask(navigation, route, null, selectedTasks, true);
        context?.clearSelectedTasks();

      },
    },
    {
      key: 'Cancel Task',
      text: t('CANCEL'),
      action: () => {
        selectedTasks?.forEach(t => {
          return dispatch(cancelTask(t, () => {}));
        });
        context?.clearSelectedTasks();
      },
    },
    {
      key: 'Report incidence',
      text: t('REPORT_INCIDENT'),
      isDisabled: selectedTasks?.length > 1,
      action: () => {
        navigateToCompleteTask(navigation, route, selectedTasks[0], [], false);
        context?.clearSelectedTasks();

      },
    },
    {
      key: 'Edit',
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
          <TouchableOpacity {...triggerProps}>
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
