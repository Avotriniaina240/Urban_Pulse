export const calculateDateRanges = (weatherData) => {
    const startDate = new Date(weatherData[0]?.time);
    const endDate = new Date(weatherData[weatherData.length - 1]?.time);
    const daysStudied = Math.ceil(Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24));

    const temperatures = weatherData.map(d => d.temperature);
    const humidities = weatherData.map(d => d.humidity);

    return {
        daysStudied,
        temperatureRange: {
            min: Math.min(...temperatures),
            max: Math.max(...temperatures)
        },
        humidityRange: {
            min: Math.min(...humidities),
            max: Math.max(...humidities)
        }
    };
};