import React, { Component } from 'react';
import { config } from '../config.js';
import moment from 'moment';
import 'moment-timezone';
import '../css/weather-icons.min.css';
const myKey = config.MY_KEY;


class WeatherClockApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: moment(),
      cities: {
        'Tokyo': {
          timeZone: 'Asia/Tokyo',
          location: '35.689487,139.691706',
        },
        'Paris': {
          timeZone: 'Europe/Paris',
          location: '48.856614,2.352222',
        },
        'San Francisco': {
          timeZone: 'America/Dawson',
          location: '37.774929,-122.419416',
        },
      },
    };
  }
  componentDidMount(){
    setInterval(() => {
      this.setState({
        currentTime: moment()
      });
    }, 1000);
  }
  render() {
    return (
      <div className="panels">
        {
          Object.keys(this.state.cities).map(city =>
            <City 
              currentTime={this.state.currentTime}
              cityName={city}
              timeZone={this.state.cities[city].timeZone}
              location={this.state.cities[city].location}
              key={city}
              APIkey={this.APIkey}
            />
          )
        }
      </div>
    );
  }
}

export default WeatherClockApp;

class City extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weatherData: {},
      weatherIcon: {
        'clear-day': 'wi-day-sunny',
        'clear-night': 'wi-night-clear',
        'rain': 'wi-rain',
        'snow': 'wi-snowflake-cold',
        'sleet': 'wi-sleet', 
        'wind': 'wi-strong-wind', 
        'fog': 'wi-fog' , 
        'cloudy': 'wi-cloudy', 
        'partly-cloudy-day': 'wi-day-cloudy',
        'partly-cloudy-night': 'wi-night-alt-partly-cloudy',
      },
      isOpen: false,
      styleName: '',
    }
  }
  async getWeather(){
    
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/',
    targetUrl = `https://api.darksky.net/forecast/${myKey}/${this.props.location}?units=si`;
    const res = await fetch(proxyUrl + targetUrl).then(res => res.json());
    const weatherData = {
      temp: `${Math.round(res.currently.temperature * 10) / 10} °C`,
      icon: this.state.weatherIcon[res.currently.icon],
    }
    const styleName = res.currently.icon;

    this.setState({ 
      weatherData,
      styleName,
     });
  }
  componentDidMount() {
    this.getWeather();
  }
  handleOnClick = () => {
    this.setState((prevState) => ({
      isOpen: !prevState.isOpen,
    }));
  }
  render() {
    return (
      <div className={`panel ${this.state.styleName} ${this.state.isOpen ? 'isOpen' : ''}`}
        onClick={this.handleOnClick}
      >
        <Name
          cityName={this.props.cityName}
        />
        <Weather
          weatherData={this.state.weatherData}
        />
        <Time
          currentTime={this.props.currentTime}
          timeZone={this.props.timeZone}
        />
      </div>
    );
  };
};

const Name = (props) => {
  return (
    <div>
      <h2>{props.cityName}</h2>
    </div>
  );
};

const Weather = (props) => {
  return (
    <div className="wether-container">
      <i className={`wi ${props.weatherData.icon}`}></i>
      <p>{props.weatherData.temp}</p>
    </div>
  );
};

const Time = (props) => {
  return (
    <div>
      <p className="day">
        {moment.tz(props.currentTime, props.timeZone).format('dddd HH:mm')}
      </p>
    </div>
  );
};

