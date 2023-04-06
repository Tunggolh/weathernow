const weatherContainer = document.querySelector(".weather-cards-container");
const searchBar = document.querySelector(".weather-search-bar");

const apiKey = ""; // INSERT API KEY HERE

const renderCurrentWeatherCard = function (weatherData) {
  const html = `
    <div class="weather-card show">
        <div class="weather-card-heading">
          <h1 class="weather-heading">${weatherData.location.name}, ${
    weatherData.location.country
  }</h1>
          <img class = "weather-icon" src="${weatherData.current.condition.icon.replace(
            "64x64",
            "128x128"
          )}">
          <h2 class="weather-card-temp">${weatherData.current.temp_f} °F</h2>
          <h2 class="weather-card-description">${
            weatherData.current.condition.text
          }</h2>
        </div><div class="weather-card-body"><p class="weather-card-time">${
          weatherData.current.last_updated
        }</p>
      </div></div>`;
  weatherContainer.insertAdjacentHTML(`beforeend`, html);
};

const renderNextWeatherCard = function (weatherData, index) {
  const getDayOfWeek = function (date) {
    const nextDate = new Date(date);
    return nextDate.toLocaleString("en-us", { weekday: "short" });
  };

  const html = `
    <div class="weather-card show">
        <div class="weather-card-heading">
          <h1 class="weather-heading">${getDayOfWeek(
            weatherData[index].date
          )}</h1>
          <img class = "weather-icon" src="${
            weatherData[index].day.condition.icon
          }">
          <h2 class="weather-card-temp">${
            weatherData[index].day.avgtemp_f
          } °F</h2>

          <div class="weather-card-body">
          <p class="weather-card-time">${weatherData[index].date}</p>
        </div>
          </div>`;
  weatherContainer.insertAdjacentHTML(`beforeend`, html);
};

const renderError = function (error) {
  removeCard();
  const html = `
  <div class="weather-card weather-card-main show">
  <div class="weather-card-heading">
    <h1 class="weather-heading">${error}</h1>
    <i class="weather-icon"></i>
  </div>
</div>`;

  weatherContainer.insertAdjacentHTML(`beforeend`, html);
};

const getJSON = function (url, errorMsg = "Something went wrong") {
  return fetch(url).then((response) => {
    console.log(!response.ok);
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);

    return response.json();
  });
};

const getWeatherData = function (city) {
  getJSON(
    `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`,
    "City Not Found"
  )
    .then((data) => {
      removeCard();
      renderCurrentWeatherCard(data);

      return getJSON(
        `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5&aqi=no&alerts=no`,
        "City Not Found"
      );
    })
    .then((data) => {
      for (let i = 1; i < 5; i++) {
        renderNextWeatherCard(data.forecast.forecastday, i);
      }
    })
    .catch((err) => renderError(err));
};

const removeCard = function () {
  while (weatherContainer.lastElementChild) {
    weatherContainer.lastElementChild.classList.remove("show");
    weatherContainer.lastElementChild.classList.add("hide");
    weatherContainer.removeChild(weatherContainer.lastChild);
  }
};

const removeExtraCards = function () {
  setTimeout(() => {
    const weatherCards = weatherContainer.querySelectorAll(".weather-card");
    if (weatherCards.length > 5) {
      for (let i = 5; i < weatherCards.length; i++) {
        weatherContainer.removeChild(weatherCards[i]);
      }
    }
  }, 1200);
};

searchBar.addEventListener("input", function (e) {
  if (e.target.value.length === 0) removeCard();
  else {
    getWeatherData(e.target.value);
    removeExtraCards();
  }
});
