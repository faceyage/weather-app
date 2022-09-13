import "./style.css";
//above required for webpack
import { api_key } from "./api_key"; //to not upload api_key to github

//making api request and
//returns weather data in json format
async function makeRequest(location) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&APPID=${api_key}`;
  const request = new Request(url);
  const response = await fetch(request, {
    mode: "cors",
  });
  const weatherData = await response.json();
  return weatherData;
}

//gets weather data from request
//returns required weather data as object
async function getWeatherObject(location) {
  const weatherData = await makeRequest(location);
  const condition = weatherData.weather[0].description;
  let temp = weatherData.main.temp;
  let tempFeel = weatherData.main.feels_like;
  temp = Math.round(temp);
  tempFeel = Math.round(tempFeel);
  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  const country = regionNames.of(weatherData.sys.country);
  const name = weatherData.name;
  const humidity = weatherData.main.humidity;
  const icon = weatherData.weather[0].icon;

  console.log(weatherData);
  return { icon, condition, temp, tempFeel, name, country, humidity };
}

//create weather html element
function createWeather() {
  //create container elements
  const weather = createElement("div", "weather");
  const top = createElement("div", "top");
  const bLeft = createElement("div", "b-left");
  const bRight = createElement("div", "b-right");

  //create weather info elements
  const condition = createElement("div", "condition");
  const _location = createElement("div", "location");
  const temp = createElement("div", "temp");
  const tempFeel = createElement("div", "tempFeel");
  const humidity = createElement("div", "humidity");
  const icon = createElement("img", "weather-icon");

  const loader = createElement("div", "loader");
  loader.classList.add("hide");
  weather.appendChild(loader);

  //add elements to containers
  weather.append(top, bLeft, bRight);
  top.append(_location, condition);
  bLeft.append(temp);
  bRight.append(tempFeel, humidity, icon);

  //Add weather to dom
  document.body.appendChild(weather);
}

//creates and loads weather data in html
async function getWeather(location) {
  const errMsg = document.querySelector(".err-msg");
  errMsg.classList.add("hide");
  let weatherData;
  toggleLoader();
  try {
    weatherData = await getWeatherObject(location);
  } catch (error) {
    errMsg.classList.remove("hide");
    toggleLoader();
    return;
  }
  toggleLoader();

  const condition = document.querySelector(".condition");
  condition.textContent = weatherData.condition;
  const _location = document.querySelector(".location");
  _location.textContent = `${weatherData.name}, ${weatherData.country}`;
  const temp = document.querySelector(".temp");
  temp.textContent = weatherData.temp;
  const tempFeel = document.querySelector(".tempFeel");
  tempFeel.textContent = `Felt Temp: ${weatherData.tempFeel} °C`;
  const humidity = document.querySelector(".humidity");
  humidity.textContent = `Humidity: ${weatherData.humidity}%`;
  const icon = document.querySelector(".weather-icon");
  icon.src = `http://openweathermap.org/img/wn/${weatherData.icon}@2x.png`;
}

//to create dom element and to minimize getWeather function
function createElement(type, className, text = "") {
  const element = document.createElement(type);
  if (className) element.classList.add(className);
  element.textContent = text;
  return element;
}

//add form to search weather status of city
function addForm() {
  const form = createElement("form");
  const searchBar = document.createElement("input");
  form.appendChild(searchBar);
  searchBar.type = "text";
  searchBar.placeholder = "Search City";

  const errMsg = createElement("span", "err-msg", "No matching location found!");
  errMsg.classList.add("hide");
  form.appendChild(errMsg);

  form.onsubmit = (event) => {
    getWeather(searchBar.value);
    form.reset();
    event.preventDefault();
  };
  document.body.appendChild(form);
}

function toggleLoader() {
  const weather = document.querySelectorAll(".weather > *");
  weather.forEach((e) => {
    e.classList.toggle("hide");
  });
}
createWeather();
addForm();
getWeather("London");
