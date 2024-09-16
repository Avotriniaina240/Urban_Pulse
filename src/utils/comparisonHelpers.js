export const airQualityDescriptions = [
    "🌟 Très bon",
    "😊 Bon",
    "😐 Moyen",
    "😷 Mauvais",
    "🚨 Très mauvais"
  ];
  
  export const weatherDescriptions = {
    "clear sky": "🌞 ciel dégagé",
    "few clouds": "🌤 peu nuageux",
    "scattered clouds": "🌥 nuages épars",
    "broken clouds": "☁️ nuages fragmentés",
    "shower rain": "🌦 averses",
    "rain": "🌧 pluie",
    "thunderstorm": "⛈ orage",
    "snow": "🌨 neige",
    "mist": "🌫 brouillard"
  };
  
  export const sortComparisonData = (data, sortBy) => {
    if (!Array.isArray(data)) {
      console.warn('sortComparisonData received non-array data:', data);
      return [];
    }
  
    return [...data].sort((a, b) => {
      switch (sortBy) {
        case 'air_quality':
          return airQualityDescriptions.indexOf(a.airQuality) - airQualityDescriptions.indexOf(b.airQuality);
        case 'weather.temperature':
          return a.weather.temperature - b.weather.temperature;
        case 'weather.humidity':
          return a.weather.humidity - b.weather.humidity;
        default:
          return 0;
      }
    });
  };