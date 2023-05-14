import { useState, useEffect } from 'react';
import './index.css';
import Header from '../Header';
import {Oval} from 'react-loader-spinner'

const SearchLocation = (props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationList, setLocationList] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  //get the locations based on the user's search
  useEffect(() => {
    if (searchTerm.length > 0) {
      const fetchLocations = async () => {
        setLoading(true);
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${searchTerm}&limit=5&appid=4c6f3246e9817e597d6334eeadb6d1d7`
        );
        const data = await response.json();
        setLocationList(data);
        setLoading(false);
      };

      fetchLocations();
    } else {
      setLocationList([]);
    }
  }, [searchTerm]);

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    setSearchTerm(location.name);
    setLocationList([]);
  };

  //Navigate to the weather details page
  const handleSearch = async () => {
    if (selectedLocation) {
      const {history} = props
      history.replace(`/weather/weather-details?location=${selectedLocation.name}`);

    }
  };
  

  const renderLoader = () => (
    <div className='loader-container'>
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
    <>
      <Header />
      <div className="search-container">
        <h1 className='search-heading'>Search The Location Here</h1>
        <div className="search-field">
          <input
            className="search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {loading ? (
            renderLoader()
          ) : locationList.length > 0 && searchTerm.length > 0 ? (
            <ul className='locations-list'>
              {locationList.map((location) => (
                <li className='location-item'
                  key={location.id}
                  onClick={() => handleLocationClick(location)}
                >
                  {location.name}, {location.country}
                </li>
              ))}
            </ul>
          ) : null}
          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
    </>
  );
};

export default SearchLocation;
