import React, { PureComponent } from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';

import {
  selectIsLoading,
  selectIsSpinnerDelayEnabled,
} from '../redux/App/selectors';
import { DdLogs } from '@datadog/mobile-react-native';

class SpinnerWrapper extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: props.loading,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.loading !== this.props.loading) {
      if (this.props.isSpinnerDelayEnabled) {
        // VISIBLE -> HIDDEN
        if (prevProps.loading && !this.props.loading) {
          DdLogs.warn('Spinner delay is applied');
          // FIXME; why do we need to apply a delay to a spinner itself on top of the delay on a modal/alert to be shown after the spinner?
          // https://github.com/ladjs/react-native-loading-spinner-overlay?tab=readme-ov-file#recommended-implementation
          // https://github.com/joinspontaneous/react-native-loading-spinner-overlay/issues/30
          setTimeout(
            () => this.setState({ isLoading: this.props.loading }),
            250,
          );
        } else {
          this.setState({ isLoading: this.props.loading });
        }
      } else {
        this.setState({ isLoading: this.props.loading });
      }
    }
  }

  render() {
    return <Spinner visible={this.state.isLoading} />;
  }
}

function mapStateToProps(state) {
  return {
    loading: selectIsLoading(state),
    isSpinnerDelayEnabled: selectIsSpinnerDelayEnabled(state),
  };
}

export default connect(mapStateToProps)(SpinnerWrapper);
