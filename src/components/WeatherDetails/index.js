import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../Header';
import './index.css'
import { Oval } from 'react-loader-spinner';

const apiStatusConstants = {
  initial: "INITIAL",
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE"
}

const WeatherDetails = () => {
  
  //Declaring states
  const location = useLocation();
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [weatherDetails, setWeatherDetails] = useState({});
  const [apiResponse, setApiResponse] = useState(apiStatusConstants.inProgress)

//Fetch Weather and Forecast data from api
  useEffect(() => {
    setApiResponse(apiStatusConstants.inProgress)
    try {
      //fetching weather data
      const fetchWeatherData = async () => {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location.search.slice(10)}&appid=ff8e4eb4740b45a6867ce7aab8f6598f`);
        const data = await response.json();
        setCurrentWeather(data);
      };
  
      //fetching forecast data
      const fetchForecastData = async () => {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location.search.slice(10)}&appid=ff8e4eb4740b45a6867ce7aab8f6598f`);
        const data = await response.json();
        setForecast(data.list);
        setApiResponse(apiStatusConstants.success)
      };
      fetchWeatherData();
      fetchForecastData();
    } catch (error) {
      setApiResponse(apiStatusConstants.failure)
    }
  }, [location.search]);

  useEffect(() => {
    if (currentWeather === null) {
      return;
    }
    // Getting sunrise and sunset times 
    const sunriseTimestamp = currentWeather.sys.sunrise;
    const sunsetTimestamp = currentWeather.sys.sunset;
    const sunriseTime = new Date(sunriseTimestamp * 1000).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour12: false });
    const sunsetTime = new Date(sunsetTimestamp * 1000).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour12: false });

    //converting wind speed into mph
    const windSpeedInMph = currentWeather.wind.speed * 2.23694;

    // calculate rain percentage
    const rainPercentageValue = currentWeather.rain ? `${currentWeather.rain['1h']} mm/h` : '0';

    setWeatherDetails({
        'high': Math.round(currentWeather.main.temp_max - 273.15),
        'low': Math.round(currentWeather.main.temp_min - 273.15),
        'sunrise': sunriseTime,
        'sunset': sunsetTime,
        'windSpeed': Math.round(windSpeedInMph),
        'rain': rainPercentageValue

    })
  }, [currentWeather]);


  //Storing favorite locations into local storage
  const handleAddToFavorites = () => {
    const getData = localStorage.getItem('favoriteList')
    const parsedData = JSON.parse(getData) || []
    const checkLocation = parsedData.includes(currentWeather.name)
    if(!checkLocation){
      parsedData.push(currentWeather.name)
    }
    localStorage.setItem('favoriteList', JSON.stringify(parsedData))
    alert('Location Added Successfully')
  };

  const renderSuccessView = () => (
    <div className='details-container'>
      <div className='details-mid-container'>
      <div className='weather-top-container details-top-container'>
      <div className='weather-report'>
        <h1 className='current-city'>
          {currentWeather.name}, {currentWeather.sys.country}
        </h1>
        <div className='temperature'>
          <img className='weather-icon' src={`https://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png`} alt={currentWeather.weather[0].description} />
          <div>
              <p className='temp-degree'>{Math.round(currentWeather.main.temp - 273.15)}°C</p>
              <p className='weather-desc'> {currentWeather.weather[0].description}</p>
          </div>
        </div>
        <button className='add-btn' onClick={handleAddToFavorites}>Add to Favorites</button>
      </div>

      {weatherDetails !== {} && 
      <div className='weather-right-container'>
        <div className='weather-extra-data'>
            <h3 className='weather-extra-data-heading'>{weatherDetails.high}&deg;</h3>
            <p className='weather-extra-data-txt'>High</p>
        </div>

        <div className='weather-extra-data'>
            <h3 className='weather-extra-data-heading'>{weatherDetails.windSpeed}mph</h3>
            <p className='weather-extra-data-txt'>Wind</p>
        </div>

        <div className='weather-extra-data'>
            <h3 className='weather-extra-data-heading'>{weatherDetails.sunrise}</h3>
            <p className='weather-extra-data-txt'>Sunrise</p>
        </div>

        <div className='weather-extra-data'>
            <h3 className='weather-extra-data-heading'>{weatherDetails.low}&deg;</h3>
            <p className='weather-extra-data-txt'>Low</p>
        </div>

        <div className='weather-extra-data'>
            <h3 className='weather-extra-data-heading'>{weatherDetails.rain}%</h3>
            <p className='weather-extra-data-txt'>Rain</p>
        </div>

        <div className='weather-extra-data'>
            <h3 className='weather-extra-data-heading'>{weatherDetails.sunset}</h3>
            <p className='weather-extra-data-txt'>Sunset</p>
        </div>
      </div>
      }
    </div>

      <h2 className='forecast-heading'>5-Day Forecast</h2>
      <div className='forecast-container'>
      {forecast.map((forecastItem) => (
        <div className='forecast-item' key={forecastItem.dt}>
          <p className='forecast-date'> {new Date(forecastItem.dt * 1000).toLocaleDateString()}</p>
          <p className='forecast-temp'> {Math.round(forecastItem.main.temp - 273.15)}°C</p>
          <img className='forecast-img' src={`https://openweathermap.org/img/w/${forecastItem.weather[0].icon}.png`} alt={forecastItem.weather[0].description} />
          <p className='forecast-desc'> {forecastItem.weather[0].description}</p>
        </div>
      ))}
      </div>
      </div>
    </div>
  )

  const renderFailureView = () => (
    <div renderEmptyView="not-found-container main-section">
      <img
        src="https://www.aamtrading.com/assets/img/nproduct.png"
        alt="not found"
        className="not-found-img"
      />
    </div>
  )

  const renderLoader = () => (
    <div className='load-container'>
        <Oval
            height={50}
            width={50}
            color="white"
            ariaLabel='oval-loading'
            secondaryColor="white"
            strokeWidth={2}
            strokeWidthSecondary={2}

            />
    </div>
  )

  const renderAllViews = () => {
    switch (apiResponse) {
      case apiStatusConstants.success:
        return renderSuccessView()
      case apiStatusConstants.failure:
        return renderFailureView()
      case apiStatusConstants.inProgress:
        return renderLoader()
      default:
        return null
    }
  }

  return (
    <>
    <Header />
    {renderAllViews()}
    </>
  );
};

export default WeatherDetails;
