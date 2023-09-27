import axios from "axios";
import React, { Component } from "react";
import logo from "./logo.png";
import "./App.css";

const OPEN_WEATHER_API_KEY = REACT_APP_API_KEY; // Replace with your API key

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cityInput: "",
      currCity: "",
      currTemp: "",
      currTempFahrenheit: "",
      weatherType: "",
      weatherDesc: "",
      weatherIconCode: "",
      dailyForecast: [],
    };
  }

  handleChange = (e) => {
    this.setState({ cityInput: e.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    axios
      .get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${this.state.cityInput}&limit=1&appid=${OPEN_WEATHER_API_KEY}`
      )
      .then((response) => {
        if (response.data && response.data[0] && response.data[0].lat) {
          return response.data[0];
        } else {
          throw new Error("City data not found or incomplete response.");
        }
      })
      .then((cityGeoData) =>
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${cityGeoData.lat}&lon=${cityGeoData.lon}&appid=${OPEN_WEATHER_API_KEY}&units=metric`
        )
      )
      .then((response) => {
        const { data: weatherData } = response;

        // Convert temperature to Fahrenheit
        const tempInFahrenheit = (weatherData.main.temp * 9) / 5 + 32;

        this.setState({
          cityInput: "",
          currCity: weatherData.name,
          currTemp: weatherData.main.temp,
          currTempFahrenheit: tempInFahrenheit,
          weatherType: weatherData.weather[0].main,
          weatherDesc: weatherData.weather[0].description,
          weatherIconCode: weatherData.weather[0].icon,
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
      });
  };

  render() {
    const { currCity, currTemp, currTempFahrenheit, weatherType, weatherDesc } =
      this.state;

    const weatherInfo = currCity ? (
      <div>
        <img
          src={`https://openweathermap.org/img/wn/${this.state.weatherIconCode}@2x.png`}
          alt="weather-icon"
        />
        <p>Current City: {currCity}</p>
        <p>
          Current Temperature: {currTemp}°C / {currTempFahrenheit}°F
        </p>
        <p>
          Current Weather: {weatherType}, {weatherDesc}
        </p>
      </div>
    ) : (
      <p>Type in the city name you want to know the weather of.</p>
    );

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <form onSubmit={this.handleSubmit}>
            <label>
              {"City: "}
              <input
                type="text"
                value={this.state.cityInput}
                onChange={this.handleChange}
              />
            </label>
            <br />
            <input type="submit" value="Check Weather" />
          </form>
          {weatherInfo}
        </header>
      </div>
    );
  }
}

export default App;
