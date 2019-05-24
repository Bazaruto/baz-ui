import PropTypes from 'prop-types';
import React from 'react';
import Select from './Select';

const propTypes = {
  time: (props, propName) => {
    if (!/([0-9]:[0-9][0-9])/.test(props[propName])) {
      return new Error('time validation failed!');
    }
  },
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

class TimePicker extends React.Component {
  constructor(props) {
    super(props);
    this.hourOptions = this.timeRange(24);
    this.minuteOptions = this.timeRange(60);
  }

  get timeArr() {
    if (!this.props.time) {
      return null;
    }
    const timeArr = this.props.time.split(':');
    if (timeArr.length === 2) {
      return timeArr;
    }
    return null;
  }

  get minutes() {
    if (this.timeArr !== null) {
      return this.props.time.split(':')[1];
    }
    return '00';
  }

  get hours() {
    if (this.timeArr !== null) {
      return this.props.time.split(':')[0];
    }
    return '00';
  }

  handleHoursChange = value => {
    this.handleTimeChange(value['hours'], this.minutes);
  };

  handleMinutesChange = value => {
    this.handleTimeChange(this.hours, value['minutes']);
  };

  handleTimeChange = (hours, minutes) => {
    const value = `${hours}:${minutes}`;
    this.props.onChange(this.props.name ? {[this.props.name]: value} : value);
  };

  timeRange(limit) {
    let range = [];
    for (let i = 0; i < limit; i++) {
      if (i < 10) {
        range.push({value: `0${i}`, label: `0${i}`});
      } else {
        range.push({value: `${i}`, label: `${i}`});
      }
    }
    return range;
  }

  render() {
    return (
      <div className="timepicker-wrapper row no-margin">
        <div className="col-sm-4 no-padding">
          <Select
            options={this.hourOptions}
            value={this.hours}
            name="hours"
            onChange={this.handleHoursChange}
            clearable={false}
            searchable />
        </div>
        <div className="col-sm-1 timepicker-separator">:</div>
        <div className="col-sm-4 no-padding">
          <Select
            options={this.minuteOptions}
            value={this.minutes}
            name="minutes"
            onChange={this.handleMinutesChange}
            clearable={false}
            searchable />
        </div>
      </div>);
  }
}

TimePicker.propTypes = propTypes;
export default TimePicker;
