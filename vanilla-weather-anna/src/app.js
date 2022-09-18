function formatDate(responseDate) {
  let date = new Date(responseDate * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[date.getDay()];

  let dateNumber = date.getDate();

  let months = [
    "Jan",
    "Fab",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[date.getMonth()];

  let hour = date.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let currentDate = `${day}, ${dateNumber} ${month} <br /> ${hour}:${minutes}`;
  return currentDate;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecastData = response.data.daily;

  let forecast = document.querySelector("#forecast");

  let forecastHTML = `<div class="row cards">`;
  forecastData.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `<div class="col weather-card">
              <p>${formatDay(forecastDay.dt)}</p>
              <img src="${changeWeatherIcon(
                forecastDay.weather[0].icon
              )}" alt="storm" id="card-weather-icon"/>
              <p class="card-temperature"><span class="card-temperature-number" id="card-temperature-number">${Math.round(
                forecastDay.temp.day
              )}</span>°</p>
            </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecast.innerHTML = forecastHTML;
}

function changeWeatherIcon(icon) {
  iconNumber = icon.slice(0, 2);
  let icons = {
    "01": "src/clear-sky.svg",
    "02": "src/few-clouds.svg",
    "03": "src/scattered-clouds.svg",
    "04": "src/broken-clouds.svg",
    "09": "src/shower-rain.svg",
    10: "src/rain.svg",
    11: "src/thunderstorm.svg",
    13: "src/snow.svg",
    50: "src/mist.svg",
  };

  return icons[iconNumber];
}

function getForecast(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=current,minutely,hourly,alerts&appid=${apiKey}`;
  if (fahrenheitButton.classList.contains("disabled")) {
    apiUrl = apiUrl + `&units=metric`;
  } else {
    apiUrl = apiUrl + `&units=imperial`;
  }

  axios.get(apiUrl).then(displayForecast);
}

function showCityTemperature(response) {
  celsiusTemperature = Math.round(response.data.main.temp);
  document.querySelector("#current-temperature").innerHTML = celsiusTemperature;

  document.querySelector("#city-name").innerHTML = response.data.name;
  document.querySelector("#country-name").innerHTML = response.data.sys.country;
  document.querySelector("#weather-description").innerHTML =
    response.data.weather[0].description;
  /* clear wind speed */
  document.querySelector("#wind-speed").innerHTML = response.data.wind.speed;
  /* end */
  document.querySelector("#current-date").innerHTML = formatDate(
    response.data.dt
  );
  document
    .querySelector("#weather-icon")
    .setAttribute("src", `${changeWeatherIcon(response.data.weather[0].icon)}`);

  getForecast(response.data.coord);
}

function searchCity(city, units) {
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(url).then(showCityTemperature);
}

function findCity(event) {
  event.preventDefault();

  let city = document.querySelector("#search-city");
  if (fahrenheitButton.classList.contains("disabled")) {
    searchCity(city.value, "metric");
  } else {
    searchCity(city.value, "imperial");
  }

  event.target.reset();
}

function getGeolocation(position) {
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(url).then(showCityTemperature);
}

function showCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getGeolocation);
}

function convertToFahrenheit(event) {
  event.preventDefault();
  fahrenheitButton.classList.remove("disabled");
  celciusButton.classList.add("disabled");

  document.querySelector("#wind-units").innerHTML = "mph";

  let city = document.querySelector("#city-name");
  city = city.textContent || city.innerText;
  searchCity(city, "imperial");
}

function convertToCelcius(event) {
  event.preventDefault();
  celciusButton.classList.remove("disabled");
  fahrenheitButton.classList.add("disabled");

  document.querySelector("#wind-units").innerHTML = "m/s";

  let city = document.querySelector("#city-name");
  city = city.textContent || city.innerText;
  searchCity(city, "metric");
}

let celsiusTemperature = null;

let apiKey = "78c40e0c1b162d404c73d8ccc4a94e0f";

let currentLocationButton = document.querySelector("#current-location");
currentLocationButton.addEventListener("click", showCurrentLocation);

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", findCity);

let fahrenheitButton = document.querySelector("#fahrenheit-button");
fahrenheitButton.addEventListener("click", convertToFahrenheit);

let celciusButton = document.querySelector("#celcius-button");
celciusButton.addEventListener("click", convertToCelcius);

searchCity("Kyiv", "metric");
