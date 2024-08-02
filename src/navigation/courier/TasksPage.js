import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import React, { Component, useMemo } from 'react';
import { withTranslation } from 'react-i18next';
import { InteractionManager, Platform, StyleSheet, View } from 'react-native';
import RNPinScreen from 'react-native-pin-screen';
import { connect, useSelector } from 'react-redux';

import DateSelectHeader from '../../components/DateSelectHeader';
import TasksMapView from '../../components/TasksMapView';
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
import { connect as connectCentrifugo } from '../../redux/middlewares/CentrifugoMiddleware/actions';
import { useGetMyTasksQuery } from '../../redux/api/slice';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

function TaskMapPage({ navigation, route }) {
  const selectedDate = useSelector(selectTaskSelectedDate);
  const tasks = useSelector(selectFilteredTasks);
  const latlng = useSelector(selectSettingsLatLng);
  const mapCenter = useMemo(() => {
    return latlng.split(',').map(parseFloat);
  }, [latlng]);

  useGetMyTasksQuery(selectedDate, {
    refetchOnFocus: true,
  });

  return (
    <View style={styles.container}>
      <DateSelectHeader navigate={navigation.navigate} />
      <TasksMapView
        mapCenter={mapCenter}
        tasks={tasks}
        onMarkerCalloutPress={task =>
          navigateToTask(navigation, route, task, tasks)
        }
      />
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
