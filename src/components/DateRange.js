import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import { formatDateTime, formatDate } from '../utils/date-utls';
import { openAtDate } from './InputDatePicker';

export default class DateRange extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    startDate: PropTypes.string,
    startDateName: PropTypes.string,
    endDate: PropTypes.string,
    minDate: PropTypes.string,
    endDateName: PropTypes.string,
    defaultDays: PropTypes.number,
    monthLimit: PropTypes.number,
    showTimePicker: PropTypes.bool,
  };

  static defaultProps = {
    defaultDays: 0,
    startDateName: 'startDate',
    endDateName: 'endDate',
  };

  state = {
    initStartDate: undefined,
    initEndDate: undefined,
  };

  format(date) {
    return this.props.showTimePicker ? formatDateTime(date) : formatDate(date);
  }

  setStartDateInputRef = input => { this.startDateInput = input; };
  setEndDateInputRef = input => { this.endDateInput = input; };

  initStartDate(startDate) {
    // Open end date picker up at the same place as this start date
    openAtDate(this.endDateInput, startDate);
    this.setState({ initStartDate: startDate });
    this.props.onChange({ [this.props.startDateName]: startDate }, true);
  }

  initEndDate(endDate) {
    // Open start date picker up at the same place as this end date
    openAtDate(this.startDateInput, endDate);
    this.setState({ initEndDate: endDate });
    this.props.onChange({ [this.props.endDateName]: endDate }, true);
  }

  handleDateRangeChange = newState => {
    const { startDateName, endDateName, defaultDays, monthLimit, minDate } = this.props;
    let startDate = newState[startDateName] || this.props.startDate || this.state.initStartDate;
    let endDate = newState[endDateName] || this.props.endDate || this.state.initEndDate;

    if (!endDate) {
      // Busy initialising from blank range, we have only picked a start date at this point
      this.initStartDate(startDate);
      return;
    }

    if (!startDate) {
      // Busy initialising from blank range, we have only picked an end date at this point
      this.initEndDate(endDate);
      return;
    }

    const startChanged = !!newState[startDateName];
    let start = Moment(startDate);
    let end = Moment(endDate);

    if (startChanged) {
      if (start.isAfter(end)) {
        end = Moment(start).add(defaultDays, 'days');
      }
      if (monthLimit) {
        end = Moment.min(end, Moment(start).add(monthLimit, 'months')); // Limited to a window
      }
    }

    if (!startChanged) {
      if (end.isBefore(start)) {
        start = Moment(end).subtract(defaultDays, 'days');
      }
      if (monthLimit) {
        start = Moment.max(start, Moment(end).subtract(monthLimit, 'months')); // Limited to a window
      }
      if (minDate) {
        start = Moment.max(start, Moment(minDate));
      }
    }

    this.props.onChange({
      [startDateName]: this.format(start),
      [endDateName]: this.format(end)
    });
  };

  render() {
    return this.props.children({
        onChange: this.handleDateRangeChange,
        value: this.props.startDate,
        name: this.props.startDateName,
        minValue: this.props.minDate,
        inputRef: this.setStartDateInputRef,
        showTimePicker: this.props.showTimePicker,
      }, {
        onChange: this.handleDateRangeChange,
        value: this.props.endDate,
        name: this.props.endDateName,
        minValue: this.props.minDate,
        inputRef: this.setEndDateInputRef,
        showTimePicker: this.props.showTimePicker,
      }
    );
  }
}

