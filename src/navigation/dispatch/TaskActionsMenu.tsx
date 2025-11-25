import { EllipsisVertical } from 'lucide-react-native';
import { NavigationProp, useRoute } from '@react-navigation/native';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { cancelTask } from '@/src/redux/Courier/taskActions';
import { navigateToCompleteTask } from '../utils';
import { startTask } from '@/src/redux/Courier';
import TasksMenu from '../components/TasksMenu';
import { useIconColor } from '@/src/styles/theme';
import { Tasks } from '@/src/types/tasks';

export interface TaskActionsMenuProps {
  navigation: NavigationProp<object>;
  tasks: Tasks;
  showCounter?: boolean;
  enabledActions?: {
    start?: boolean;
    complete?: boolean;
    cancel?: boolean;
    reportIncident?: boolean;
    edit?: boolean;
    assign?: boolean;
  };
  onClearSelection?: () => void;
  onAssign?: () => void;
  cancelContext?: 'tasks' | 'order';
  entityName?: string;
}

export const TaskActionsMenu: React.FC<TaskActionsMenuProps> = ({
  navigation,
  tasks,
  showCounter = false,
  enabledActions = {
    start: false,
    complete: false,
    cancel: false,
    reportIncident: false,
  },
  onAssign,
  onClearSelection,
  cancelContext = 'tasks',
  entityName
}) => {
  const { t } = useTranslation();
  const iconColor = useIconColor();
  const dispatch = useDispatch();
  const route = useRoute();

  const options = [];

  // Assign option
  if (enabledActions.assign && onAssign) {
    options.push({
      key: 'Assign',
      text: t('ASSIGN'),
      action: onAssign,
    });
  }

  // Start Task option
  if (enabledActions.start) {
    options.push({
      key: 'StartTask',
      text: t('START'),
      action: () => {
        for (const task of tasks) {
          dispatch(startTask(task, () => {}));
        }
        onClearSelection?.();
      },
    });
  }

  // Complete Task option
  if (enabledActions.complete) {
    options.push({
      key: 'CompleteTask',
      text: t('COMPLETE_TASK'),
      action: () => {
        navigateToCompleteTask(navigation, route, tasks[0], tasks, true);
      },
    });
  }

  // Cancel option
  if (enabledActions.cancel) {
    options.push({
      key: 'CancelTask',
      text: t('CANCEL'),
      action: () => {
        const isPlural = tasks.length > 1;
        let entity: string;
        let name: string;
        let messageKey: string;

        if (cancelContext === 'order' && entityName) {
          entity = t('ORDER');
          name = entityName;
          messageKey = 'CANCEL_MESSAGE_WITH_TASKS';
        } else {
          entity = isPlural ? t('TASKS') : t('TASK');
          name = isPlural
            ? `${tasks.length} ${entity}`
            : String(tasks[0].id || '');
          messageKey = isPlural ? 'CANCEL_MESSAGE_PLURAL' : 'CANCEL_MESSAGE';
        }

        Alert.alert(
          t('CANCEL_TITLE', { entity }),
          t(messageKey, { entity, name, count: tasks.length }),
          [
            { text: t('CANCEL'), style: 'cancel' },
            {
              text: t('PROCEED'),
              style: 'destructive',
              onPress: () => {
                try {
                  for (const task of tasks) {
                    dispatch(cancelTask(task, () => {}));
                  }
                  if (cancelContext === 'order') {
                    navigation.goBack();
                  }
                } catch (error) {
                  console.error('Cancel task/s error:', error);
                  Alert.alert(
                    t('CANCEL_ERROR_TITLE'),
                    t('CANCEL_ERROR_MESSAGE', { entity }),
                  );
                } finally {
                  onClearSelection?.();
                }
              },
            },
          ],
        );
      },
    });
  }

  // Report Incident option
  if (enabledActions.reportIncident) {
    options.push({
      key: 'ReportIncidence',
      text: t('REPORT_INCIDENT'),
      isDisabled: tasks.length > 1,
      action: () => {
        navigateToCompleteTask(navigation, route, tasks[0], [], false);
      },
    });
  }

  return (
    <View>
      <TasksMenu
        options={options}
        renderTrigger={triggerProps => (
          <TouchableOpacity {...triggerProps} testID={showCounter ? 'selectedTasksToEditMenuButton' : undefined}>
            <View style={showCounter ? styles.container : styles.simpleContainer}>
              {showCounter && (
                <Text style={styles.counter}>
                  {tasks.length}
                </Text>
              )}
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
  simpleContainer: {
    marginRight: 10,
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
