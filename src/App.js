import React, { Component } from 'react';
import './css/App.css';
import WeatherClockApp from './components/View';

class App extends Component {
  render() {
    return (
      <div className="App">
      <WeatherClockApp />
      </div>
    );
  }
}

export default App;
