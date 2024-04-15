import React, { Component } from 'react';
import { InteractionManager, Platform, StyleSheet, View } from 'react-native';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import RNPinScreen from 'react-native-pin-screen';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import DateSelectHeader from '../../components/DateSelectHeader';
import TasksMapView from '../../components/TasksMapView';
import {
  loadTasks,
  selectFilteredTasks,
  selectKeepAwake,
  selectTaskSelectedDate,
} from '../../redux/Courier';
import { navigateToTask } from '../../navigation/utils';

import { selectIsCentrifugoConnected } from '../../redux/App/selectors';
import { connect as connectCentrifugo } from '../../redux/middlewares/CentrifugoMiddleware/actions';

class TasksPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      task: null,
      polyline: [],
      isFocused: false,
    };

    this.refreshTasks = this.refreshTasks.bind(this);
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
      this.refreshTasks(this.props.selectedDate);
      if (!this.props.selectIsCentrifugoConnected) {
        this.props.connectCent();
      }
    });
  }

  refreshTasks(selectedDate) {
    this.props.loadTasks(selectedDate);
  }

  render() {
    const { tasks } = this.props;

    return (
      <View style={styles.container}>
        <DateSelectHeader navigate={this.props.navigation.navigate} />
        <TasksMapView
          mapCenter={this.props.mapCenter}
          tasks={tasks}
          onMarkerCalloutPress={task =>
            navigateToTask(this.props.navigation, this.props.route, task, tasks)
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

function mapStateToProps(state) {
  return {
    tasks: selectFilteredTasks(state),
    selectedDate: selectTaskSelectedDate(state),
    keepAwake: selectKeepAwake(state),
    isCentrifugoConnected: selectIsCentrifugoConnected(state),
    httpClient: state.app.httpClient,
    mapCenter: state.app.settings.latlng.split(',').map(parseFloat),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadTasks: selectedDate => dispatch(loadTasks(selectedDate)),
    connectCent: () => dispatch(connectCentrifugo()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(TasksPage));
