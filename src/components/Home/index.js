import {  useEffect, useState } from 'react'
import { useGeolocated } from "react-geolocated";
import './index.css'
import WeatherCard from '../WeatherCard';
import Header from '../Header';
import { Oval } from 'react-loader-spinner';

const Home = () => {

  // Declaring states
  const [data, setData] = useState(null)
  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
  });

  //Fetching current weather data through calling api
  useEffect(() => {
    console.log(coords)
    const fetchData = async () => {
      if (coords) {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=ff8e4eb4740b45a6867ce7aab8f6598f`
        console.log(url)
        const response = await fetch(url)
        const data = await response.json()
        setData(data)
      }
    }
    fetchData()
  }, [coords])


  const renderFailureView = () => (
    <div className="not-found-container">
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

  return (
    <><Header />
    <div className='main-container'>
      {isGeolocationAvailable && isGeolocationEnabled ? (
        data ? (
          <WeatherCard data={data} />
        ) : (
          renderLoader()
        )
      ) : (
        renderFailureView()
      )}
    </div>
    </>
  )
}

export default Home
