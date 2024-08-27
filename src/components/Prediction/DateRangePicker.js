import React from 'react';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

const DateRangePicker = ({ onDateChange }) => {
  return (
    <RangePicker
      style={{ width: 300 }}
      onChange={onDateChange}
      format="YYYY-MM-DD"
    />
  );
};

export default DateRangePicker;
