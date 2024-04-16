import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';

import { withTranslation } from 'react-i18next';
import DateSelectHeader from '../../components/DateSelectHeader';
import TapToRefresh from '../../components/TapToRefresh';
import TaskList from '../../components/TaskList';
import { navigateToCompleteTask, navigateToTask } from '../../navigation/utils';
import {
  loadTasks,
  selectFilteredTasks,
  selectIsTasksRefreshing,
  selectTaskSelectedDate,
  selectTasksWithColor,
} from '../../redux/Courier';
import { doneIconName } from '../task/styles/common';

const styles = StyleSheet.create({
  containerEmpty: {
    alignItems: 'center',
    paddingTop: 0,
  },
  container: {
    flex: 1,
  },
  wrapper: {
    paddingHorizontal: 15,
  },
});

class TaskListPage extends Component {
  completeSelectedTasks(selectedTasks) {
    if (selectedTasks.length > 1) {
      navigateToCompleteTask(
        this.props.navigation,
        this.props.route,
        null,
        selectedTasks,
        true,
      );
    } else if (selectedTasks.length === 1) {
      navigateToCompleteTask(
        this.props.navigation,
        this.props.route,
        selectedTasks[0],
        [],
        true,
      );
    }
  }

  allowToSelect(task) {
    return task.status !== 'DONE';
  }

  render() {
    const { tasks, tasksWithColor, selectedDate } = this.props;

    const containerStyle = [styles.container];
    if (tasks.length === 0) {
      containerStyle.push(styles.containerEmpty);
    }

    return (
      <View style={containerStyle}>
        <DateSelectHeader navigate={this.props.navigation.navigate} />
        {tasks.length > 0 && (
          <TaskList
            tasks={tasks}
            tasksWithColor={tasksWithColor}
            onSwipeLeft={task =>
              navigateToCompleteTask(
                this.props.navigation,
                this.props.route,
                task,
                [],
                true,
              )
            }
            onSwipeRight={task =>
              navigateToCompleteTask(
                this.props.navigation,
                this.props.route,
                task,
                [],
                false,
              )
            }
            swipeOutLeftEnabled={task => task.status !== 'DONE'}
            swipeOutRightEnabled={task => task.status !== 'DONE'}
            onTaskClick={task =>
              navigateToTask(
                this.props.navigation,
                this.props.route,
                task,
                tasks,
              )
            }
            refreshing={this.props.isRefreshing}
            onRefresh={() => this.props.refreshTasks(selectedDate)}
            allowMultipleSelection={task => this.allowToSelect(task)}
            multipleSelectionIcon={doneIconName}
            onMultipleSelectionAction={selectedTasks =>
              this.completeSelectedTasks(selectedTasks)
            }
          />
        )}
        {tasks.length === 0 && (
          <TapToRefresh onPress={() => this.props.loadTasks(selectedDate)} />
        )}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    tasks: selectFilteredTasks(state),
    tasksWithColor: selectTasksWithColor(state),
    selectedDate: selectTaskSelectedDate(state),
    isRefreshing: selectIsTasksRefreshing(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadTasks: selectedDate => dispatch(loadTasks(selectedDate)),
    refreshTasks: selectedDate => dispatch(loadTasks(selectedDate, true)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(TaskListPage));
