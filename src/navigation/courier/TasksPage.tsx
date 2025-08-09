import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import {
  ActivityIndicator,
  InteractionManager,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { Component, useMemo } from 'react';
import { connect, useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import RNPinScreen from 'react-native-pin-screen';

import { blueColor } from '../../styles/common';
import { connectCentrifugo } from '../../redux/middlewares/CentrifugoMiddleware/actions';
import { createCurrentTaskList } from '../../shared/src/logistics/redux/taskListUtils';
import { navigateToTask } from '../../navigation/utils';
import {
  selectFilteredTasks,
  selectKeepAwake,
  selectTaskSelectedDate,
} from '../../redux/Courier';
import {
  selectIsCentrifugoConnected,
  selectSettingsLatLng,
} from '../../redux/App/selectors';
import { useGetMyTasksQuery } from '../../redux/api/slice';
import DateSelectHeader from '../../components/DateSelectHeader';
import TasksMapView from '../../components/TasksMapView';
import { DateOnlyString } from '../../utils/date-types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  activityContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    margin: 8,
  },
  activityIndicator: {
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 8,
  },
});

function TaskMapPage({ navigation, route }) {
  const selectedDate = useSelector(selectTaskSelectedDate);
  const tasks = useSelector(selectFilteredTasks);
  const latlng = useSelector(selectSettingsLatLng);

  const courierTaskList = useMemo(() => {
    const taskList = createCurrentTaskList(tasks);
    // Override color for courier
    taskList.color = blueColor;
    taskList.items = taskList.items.map(task => ({
      ...task,
      color: blueColor,
    }));

    return taskList;
  }, [tasks]);

  const mapCenter = useMemo(() => {
    return latlng.split(',').map(parseFloat);
  }, [latlng]);

  const { isFetching } = useGetMyTasksQuery(selectedDate.format('YYYY-MM-DD') as DateOnlyString, {
    refetchOnFocus: true,
  });

  return (
    <View style={styles.container}>
      <DateSelectHeader navigate={navigation.navigate} />
      <View style={{ flex: 1 }}>
        <TasksMapView
          mapCenter={mapCenter}
          taskLists={[courierTaskList]}
          onMarkerCalloutPress={task =>
            // We use `courierTaskList.items` here so each task has the properties added at `createCurrentTaskList`
            navigateToTask(navigation, route, task, courierTaskList.items)
          }
        />
        {isFetching ? (
          <View style={styles.activityContainer}>
            <ActivityIndicator
              style={styles.activityIndicator}
              animating={true}
              size="large"
            />
          </View>
        ) : null}
      </View>
    </View>
  );
}

class TasksPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFocused: false,
    };
  }

  enableKeepAwake() {
    if (Platform.OS === 'ios') {
      activateKeepAwakeAsync();
    } else {
      RNPinScreen.pin();
    }
  }

  disableKeepAwake() {
    if (Platform.OS === 'ios') {
      deactivateKeepAwake();
    } else {
      RNPinScreen.unpin();
    }
  }

  componentDidMount() {
    this._bootstrap();

    if (this.props.keepAwake && this.props.isFocused) {
      this.enableKeepAwake();
    }

    this.unsubscribeFromFocusListener = this.props.navigation.addListener(
      'focus',
      () => this.setState({ isFocused: true }),
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.isFocused !== this.state.isFocused ||
      prevProps.keepAwake !== this.props.keepAwake
    ) {
      if (this.props.keepAwake && this.state.isFocused) {
        this.enableKeepAwake();
      } else {
        this.disableKeepAwake();
      }
    }
  }

  componentWillUnmount() {
    this.unsubscribeFromFocusListener();
  }

  _bootstrap() {
    InteractionManager.runAfterInteractions(() => {
      if (!this.props.isCentrifugoConnected) {
        this.props.connectCent();
      }
    });
  }

  render() {
    return (
      <TaskMapPage
        navigation={this.props.navigation}
        route={this.props.route}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    keepAwake: selectKeepAwake(state),
    isCentrifugoConnected: selectIsCentrifugoConnected(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    connectCent: () => dispatch(connectCentrifugo()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(TasksPage));
