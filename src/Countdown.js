import React, { Component } from 'react';
import * as Progress from 'react-native-progress';

class Countdown extends Component {
  intervalID = null;
  constructor(props) {
    super(props);
    this.state = {
      remaining: props.duration,
      progress: 1
    }
  }
  componentDidMount() {
    this.intervalID = setInterval(() => {

      let remaining = this.state.remaining;
      remaining--;

      let progress = ((remaining * 100) / this.props.duration) / 100;

      this.setState({
        remaining: remaining,
        progress: progress
      });

      if (remaining === 0) {
        clearInterval(this.intervalID);
        this.props.onComplete();
      }

    }, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.intervalID);
  }
  render() {
    return (
      <Progress.Circle showsText progress={this.state.progress} size={60} formatText={(progress) => {
        return this.state.remaining + 's';
      }} />
    )
  }
}

module.exports = Countdown;