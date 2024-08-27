import React from 'react';
import { Select } from 'antd'; // Utilisation de Ant Design pour un UI moderne

const { Option } = Select;

const CitySelector = ({ cities, onSelectCity }) => {
  return (
    <Select
      showSearch
      style={{ width: 300 }}
      placeholder="Sélectionnez une ville ou un quartier"
      optionFilterProp="children"
      onChange={onSelectCity}
    >
      {cities.map(city => (
        <Option key={city.id} value={city.name}>
          {city.name}
        </Option>
      ))}
    </Select>
  );
};

export default CitySelector;
