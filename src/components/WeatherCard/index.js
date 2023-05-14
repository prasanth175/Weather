import { useState, useEffect } from 'react';
import {  v4 as uuidv4} from 'uuid'
import { AiOutlineDelete } from "react-icons/ai";
import './index.css'
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

const WeatherCard = ( weatherData) => {

  //Declaring states
  const [temperature, setTemperature] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [weatherDetails, setWeatherDetails] = useState({});
  const [favoriteList, setFavoriteList] = useState([]);

  //Getting favorite Locations List from local storage
  useEffect(() => {
    const getData = localStorage.getItem('favoriteList');
    const parsedData = JSON.parse(getData);
    setFavoriteList(parsedData || []);
  }, []);


  //Removing Location from favorite List
  const onDelete = (locationId) => {
    const updatedData = favoriteList.filter(location => location !== locationId);
    localStorage.setItem('favoriteList', JSON.stringify(updatedData));
    setFavoriteList(updatedData);
  }


  useEffect(() => {
    const {data} = weatherData
    if (!data) {
      return;
    }

    //Getting sunrise and sunset times
    const sunriseTimestamp = data.sys.sunrise;
    const sunsetTimestamp = data.sys.sunset;
    const sunriseTime = new Date(sunriseTimestamp * 1000).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour12: false });
    const sunsetTime = new Date(sunsetTimestamp * 1000).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour12: false });

    //Convert wind speed into mph
    const windSpeedInMph = data.wind.speed * 2.23694;

    // calculate rain percentage
    const rainPercentageValue = weatherData.rain ? `${weatherData.rain['1h']} mm/h` : '0';

    setTemperature(Math.round(data.main.temp - 273.15));
    setDescription(data.weather[0].description);
    setIcon(`https://openweathermap.org/img/w/${data.weather[0].icon}.png`);
    setWeatherDetails({
        'high': Math.round(data.main.temp_max - 273.15),
        'low': Math.round(data.main.temp_min - 273.15),
        'sunrise': sunriseTime,
        'sunset': sunsetTime,
        'windSpeed': Math.round(windSpeedInMph),
        'rain': rainPercentageValue

    })
  }, [weatherData]);

  return (
    <div className='current-weather'>
    <div className='weather-top-container'>
    <div className='weather-report'>
      <Link className='nav-link' to={`/weather/weather-details?location=${weatherData.data.name}`}><h1 className='current-city'>
        {weatherData.data.name}, {weatherData.data.sys.country}
      </h1></Link>
      <div className='temperature'>
        <img className='weather-icon' src={icon} alt={description} />
        <div>
            <p className='temp-degree'>{temperature}&deg;C</p>
            <p className='weather-desc'>{description}</p>
        </div>
      </div>
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
      {/* {Showing Favorite Locations on the web page} */}
      <div className='favorite-container'>
        <h1 className='favorite-heading'>Favorite Locations :</h1>
        <ul className='favorite-list'>
          {favoriteList.length !== 0 ? favoriteList.map((each) => <li className='favorite-list-item' key={uuidv4()}>
          <p className='favorite-city'>{each}</p>
          <AiOutlineDelete className='del-img' onClick={() => onDelete(each)} />
          </li>) : <div className='no-favorites-container'><p className='no-favorites'>No Favorite Locations are added</p></div>}
        </ul>
      </div>
    </div>
  );
};

export default WeatherCard;
