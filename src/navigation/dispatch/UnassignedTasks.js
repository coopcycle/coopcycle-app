import { Box, Text } from 'native-base';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, InteractionManager, View } from 'react-native';
import { connect, useDispatch, useSelector } from 'react-redux';

import TapToRefresh from '../../components/TapToRefresh';
import TaskList from '../../components/TaskList';
import {
  selectSelectedDate,
  selectTasksWithColor,
  selectUnassignedTasks,
} from '../../coopcycle-frontend-js/logistics/redux';
import { navigateToTask } from '../../navigation/utils';
import {
  assignTask,
  bulkAssignmentTasks,
  initialize,
} from '../../redux/Dispatch/actions';
import AddButton from './components/AddButton';
import { useLoadAllTasks } from '../../hooks/useLoadAllTasks';


function UnassignedTasks({
  navigation,
  tasksWithColor,
  route,
}) {
  const dispatch = useDispatch();
  const date = useSelector(selectSelectedDate);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      dispatch(initialize());
    });
  }, [dispatch]);

  const {
    error,
    isLoading,
    refreshTasks
  } = useLoadAllTasks(date, { enabled: true});

  const { t } = useTranslation()

  const unassignedTasks = useSelector(selectUnassignedTasks)

  const _assignTask = (task, user) => {
    navigation.navigate('DispatchUnassignedTasks');
    dispatch(assignTask(task, user.username));
  }

  const assignSelectedTasks = (selectedTasks) => {
    navigation.navigate('DispatchPickUser', {
      onItemPress: user => _bulkAssign(user, selectedTasks),
    });
  }

  const _bulkAssign = (user, tasks) => {
    navigation.navigate('DispatchUnassignedTasks');
    dispatch(bulkAssignmentTasks(tasks, user.username));
  }

  const allowToSelect = (task) => {
    return task.status !== 'DONE';
  }

  const { navigate } = navigation;
  const isEmpty = unassignedTasks?.length === 0;

  return (
    <View style={{ flex: 1 }}>
      <View>
        <AddButton
          testID="dispatchNewDelivery"
          onPress={() => navigation.navigate('DispatchNewDelivery')}>
          <Text style={{ fontWeight: '700' }}>
            {date.format('ll')}
          </Text>
        </AddButton>
      </View>
      <View style={{ flex: 1 }}>
        {isLoading &&
          <Box flex={1} justifyContent="center" alignItems="center">
            <ActivityIndicator animating={true} size="large" />
          </Box>}
        {error && <Text style={{ textAlign: 'center' }}>{t('AN_ERROR_OCCURRED')}</Text>}
        {isEmpty && <TapToRefresh onPress={refreshTasks} />}
        {!isEmpty && (
          <TaskList
            tasks={unassignedTasks}
            tasksWithColor={tasksWithColor}
            swipeOutLeftEnabled={task => !task.isAssigned}
            onSwipeLeft={task =>
              navigate('DispatchPickUser', {
                onItemPress: user => _assignTask(task, user),
              })
            }
            swipeOutLeftIconName="user"
            onTaskClick={task =>
              navigateToTask(
                navigation,
                route,
                task,
                unassignedTasks,
              )
            }
            allowMultipleSelection={task => allowToSelect(task)}
            multipleSelectionIcon="user"
            onMultipleSelectionAction={selectedTasks =>
              assignSelectedTasks(selectedTasks)
            }
          />
        )}
      </View>
    </View>
  );
}

function mapStateToProps(state) {
  return {
    tasksWithColor: selectTasksWithColor(state),
    user: state.app.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnassignedTasks);
