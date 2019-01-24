import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import Moment from 'moment';
import { YEAR_MONTH_DAY_TIME, YEAR_MONTH_DAY } from '../constants/date-format';
import $ from 'jquery';
import '../libs/bootstrap-datetimepicker.min';

const propTypes = {
  startDate: PropTypes.string,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  onApply: PropTypes.func.isRequired,
  className: PropTypes.string,
  identifier: PropTypes.string,
  showTimePicker: PropTypes.bool,
  viewMode: PropTypes.string,
  disabled: PropTypes.bool,
};

const defaultProps = {
  startDate: '',
  className: 'datepicker--input',
  viewMode: 'days',
};

export function openAtDate(input, date) {
  setProperty($(input), 'viewDate', date);
  input.focus();
}

function setProperty($picker, property, value) {
  return $picker.data('DateTimePicker')[property](value);
}

export default class InputDatePicker extends React.Component {
  componentDidMount() {
    const { showTimePicker, defaultDate, startDate, viewMode, minDate, maxDate } = this.props;
    const format = showTimePicker ? YEAR_MONTH_DAY_TIME : YEAR_MONTH_DAY;
    const $picker = $(this.picker).datetimepicker({
      format,
      defaultDate: startDate,
      useCurrent: false, // If we have no initial value, we keep the input blank
      keyBinds: null,
      sideBySide: true,
      viewMode: viewMode,
    });

    if (minDate) {
      setProperty($picker, 'minDate', minDate);
    }

    if (maxDate) {
      setProperty($picker, 'maxDate', maxDate);
    }

    // Only apply date when we hide the picker
    $picker.on('dp.hide', (e) => {
      if (_.isEmpty($picker.val())) {
        // Revert back if we have a date set
        if (this.props.startDate) {
          setProperty($picker, 'date', this.props.startDate);
        } else {
          // Blank state UX: Hack to open up the picker at the same place it was last closed
          const currentViewDate = $picker.data('DateTimePicker').viewDate();
          setTimeout(() => setProperty($picker, 'viewDate', currentViewDate), 0);
        }
        return;
      }
      const newValue = Moment($picker.val()).format(format);
      if (newValue !== this.props.startDate) {
        this.props.onApply(newValue);
      }
    });

    // Key bindings are turned off, so we can determine our custom behaviour
    $picker.on('keyup', (e) => {
      // Do nothing if arrow keys are being used
      if (e.which >= 37 && e.which <= 40) {
        return;
      }
      // Set date and hide picker on enter
      if (e.which === 13) {
        const dropDown = $picker.data('DateTimePicker');
        dropDown.date($picker.val());
        dropDown.hide();
        // If the date is strictly valid as we type, then set date and keep cursor position
      } else if (Moment($picker.val(), format, true).isValid()) {
        const start = $picker[0].selectionStart;
        const end = $picker[0].selectionEnd;

        setProperty($picker, 'date', $picker.val());
        $picker[0].setSelectionRange(start, end);
        this.props.onApply($picker.val());
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const $picker = $(this.picker);
    if (this.props.minDate !== nextProps.minDate) {
      setProperty($picker, 'minDate', nextProps.minDate);
    }
    if (this.props.maxDate !== nextProps.maxDate) {
      setProperty($picker, 'maxDate', nextProps.maxDate);
    }
    // Apply the new date last as the min/max date could have changed as well
    if ($picker.val() !== nextProps.startDate) {
      setProperty($picker, 'date', nextProps.startDate);
    }
  }

  componentWillUnmount() {
    $(this.picker).data('DateTimePicker').destroy();
  }

  handleRef = ref => {
    this.picker = ref;
    const { inputRef } = this.props;
    if (inputRef) {
      inputRef(ref);
    }
  };

  handleCalendarClick = () => this.picker.focus();

  render() {
    return (
      <span className="date-time-input-container">
        <input
          ref={this.handleRef}
          type="text"
          className="form-control"
          name={this.props.identifier}
          disabled={this.props.disabled}
          placeholder={this.props.placeholder}
          data-identifier={this.props.dataIdentifier}
          autoComplete="off"
        />
        <span onClick={this.handleCalendarClick} className="icon-container">
          <span className="icon-calendar" />
        </span>
      </span>
    )
  }
}

InputDatePicker.propTypes = propTypes;
InputDatePicker.defaultProps = defaultProps;
