import {Switch, Route} from 'react-router-dom'
import './App.css'
import Home from './components/Home'
import SearchLocation from './components/SearchLocation'
import WeatherDetails from './components/WeatherDetails'
import NotFound from './components/NotFound'

const App = () => {
    return (
          <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/search-location' component={SearchLocation} />
          <Route exact path='/weather-details' component={WeatherDetails} />
          <Route component={NotFound} />
        </Switch>
    )
  }

export default App
