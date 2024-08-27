import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const IndicatorSelector = ({ indicators, onSelectIndicator }) => {
  return (
    <Select
      style={{ width: 300 }}
      placeholder="Sélectionnez un indicateur"
      onChange={onSelectIndicator}
    >
      {indicators.map(indicator => (
        <Option key={indicator.id} value={indicator.name}>
          {indicator.name}
        </Option>
      ))}
    </Select>
  );
};

export default IndicatorSelector;
