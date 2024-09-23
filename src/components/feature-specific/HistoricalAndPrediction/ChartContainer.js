import React, { useState } from 'react';
import BarChartComponent from './BarChartComponent';
import LineChartComponent from './LineChartComponent';

const ChartContainer = ({ weatherData, cityName, daysStudied, temperatureRange, humidityRange }) => {
    const [selectedPoint, setSelectedPoint] = useState(null);

    return (
        <div className="chart-container-pre">
            <BarChartComponent 
                data={weatherData}
                cityName={cityName}
                daysStudied={daysStudied}
                temperatureRange={temperatureRange}
                humidityRange={humidityRange}
            />
            <LineChartComponent 
                data={weatherData}
                cityName={cityName}
                selectedPoint={selectedPoint}
                setSelectedPoint={setSelectedPoint}
            />
        </div>
    );
};

export default ChartContainer;