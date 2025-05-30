import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaCloud, FaCloudRain, FaSmog, FaSnowflake, FaSun } from 'react-icons/fa';

function WeatherApp() {
  const [location, setLocation] = useState('London');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const API_KEY = 'e38a53a4bb063f2fe8746c3962bead68'; // Replace with your actual Weatherstack API key

  useEffect(() => {
    fetchWeather();
  }, [location]); // Re-fetch weather when location changes

  const fetchWeather = async () => {
    try {
      const response = await axios.get(
        `http://api.weatherstack.com/current?access_key=${API_KEY}&query=${location}`
      );

      if (response.data.error) {
        setError(response.data.error.info);
        setWeather(null);
        return;
      }

      const data = response.data;
      const transformedWeather = {
        name: data.location.name,
        sys: { country: data.location.country },
        main: {
          temp: data.current.temperature,
          humidity: data.current.humidity,
        },
        wind: { speed: data.current.wind_speed },
        weather: [
          {
            description: data.current.weather_descriptions[0],
            icon: data.current.weather_code, // Weatherstack provides a code, we'll map it
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

  const getWeatherIcon = (weatherCode) => {
    // Weatherstack provides a weather_code. We'll map some common ones to icons.
    // This is a simplified mapping. You might need a more comprehensive one.
    if (weatherCode >= 113 && weatherCode <= 116) { // Clear/Partly Cloudy
      return <FaSun className="text-yellow-400" />;
    } else if (weatherCode >= 119 && weatherCode <= 122) { // Cloudy/Overcast
      return <FaCloud className="text-gray-400" />;
    } else if (weatherCode >= 176 && weatherCode <= 200) { // Rain/Showers
      return <FaCloudRain className="text-blue-400" />;
    } else if (weatherCode >= 227 && weatherCode <= 230) { // Snow
      return <FaSnowflake className="text-white" />;
    } else if (weatherCode >= 248 && weatherCode <= 260) { // Fog/Mist
      return <FaSmog className="text-gray-500" />;
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