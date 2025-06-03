import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaBolt, FaCloud, FaCloudRain, FaSmog, FaSnowflake, FaSun } from 'react-icons/fa';

function WeatherApp() {
  const [location, setLocation] = useState('London');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWeather();
  }, [location]); // Re-fetch weather when location changes

  const fetchWeather = async () => {
    try {
      // Open-Meteo API requires latitude and longitude. We'll need a geocoding step.
      // For simplicity, this example will use a hardcoded lat/lon for a common city
      // or you would integrate a geocoding API (e.g., OpenStreetMap Nominatim).
      // For now, let's assume 'location' can be directly used if it's a city name
      // and we'll fetch lat/lon for it first.

      // A more robust solution would involve a geocoding API call here.
      // For demonstration, let's use a placeholder for lat/lon based on a city search.
      // This is a simplified approach and might not work for all 'location' inputs directly.
      const geoResponse = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${location}`
      );

      if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
        setError('Location not found.');
        setWeather(null);
        return;
      }

      const { latitude, longitude } = geoResponse.data.results[0];

      const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=celsius&windspeed_unit=kmh&precipitation_unit=mm`
      );

      if (!response.data.current_weather) {
        setError('Could not fetch weather data.');
        setWeather(null);
        return;
      }

      const data = response.data.current_weather;
      const transformedWeather = {
        name: location, // Open-Meteo doesn't return city name directly in current_weather
        sys: { country: geoResponse.data.results[0].country }, // Get country from geocoding
        main: {
          temp: data.temperature,
          humidity: null, // Open-Meteo current_weather doesn't provide humidity directly
        },
        wind: { speed: data.windspeed },
        weather: [
          {
            description: 'N/A', // Open-Meteo current_weather doesn't provide description directly
            icon: data.weathercode, // Open-Meteo provides a weathercode
          },
        ],
      };
      setWeather(transformedWeather);
      setError('');
    } catch (err) {
      setWeather(null);
      setError('Location not found or API error. Please try again.');
      console.error(err);
    }
  };

  const getWeatherIcon = (weathercode) => {
    // Open-Meteo weather codes (WMO Weather interpretation codes)
    // https://www.open-meteo.com/en/docs
    if (weathercode === 0) { // Clear sky
      return <FaSun className="text-yellow-400" />;
    } else if (weathercode >= 1 && weathercode <= 3) { // Mainly clear, partly cloudy, and overcast
      return <FaCloud className="text-gray-400" />;
    } else if (weathercode >= 45 && weathercode <= 48) { // Fog and depositing rime fog
      return <FaSmog className="text-gray-500" />;
    } else if ((weathercode >= 51 && weathercode <= 55) || (weathercode >= 61 && weathercode <= 65) || (weathercode >= 80 && weathercode <= 82)) { // Drizzle, Rain, Rain showers
      return <FaCloudRain className="text-blue-400" />;
    } else if ((weathercode >= 56 && weathercode <= 57) || (weathercode >= 66 && weathercode <= 67) || (weathercode >= 85 && weathercode <= 86)) { // Freezing Drizzle, Freezing Rain, Snow showers
      return <FaSnowflake className="text-white" />;
    } else if (weathercode >= 71 && weathercode <= 75) { // Snow fall
      return <FaSnowflake className="text-white" />;
    } else if (weathercode >= 95 && weathercode <= 99) { // Thunderstorm
      return <FaBolt className="text-yellow-500" />;
    } else {
      return <FaCloud className="text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-600 to-gray-900">
      <div className="w-full max-w-md p-8 bg-white bg-opacity-20 rounded-xl shadow-lg backdrop-filter backdrop-blur-lg border border-opacity-30 border-white relative z-10 animate-gradient-xy">
        <div className="bubbles">
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
        </div>
        <div className="stars">
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
        </div>
        <h1 className="text-4xl font-bold text-center mb-6">Weather App</h1>
        <div className="flex mb-6">
          <input
            type="text"
            className="flex-grow p-3 rounded-l-lg focus:outline-none text-gray-800"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                fetchWeather();
              }
            }}
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-r-lg"
            onClick={()=>fetchWeather()}
          >
            Search
          </button>
        </div>

        {error && <p className="text-red-300 text-center mb-4">{error}</p>}

        {weather && (
          <div className="text-center">
            <h2 className="text-3xl font-semibold mb-2">{weather.name}, {weather.sys.country}</h2>
            <div className="text-6xl mb-4 flex justify-center items-center">
              {getWeatherIcon(weather.weather[0].icon)}
              <span className="ml-4">{Math.round(weather.main.temp)}°C</span>
            </div>
            <p className="text-xl mb-2">{weather.weather[0].description}</p>
            <div className="flex justify-around text-lg mt-4">
              <div>
                <p>Wind</p>
                <p className="font-bold">{weather.wind.speed} m/s</p>
              </div>
              <div>
                <p>Humidity</p>
                <p className="font-bold">{weather.main.humidity}%</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WeatherApp;