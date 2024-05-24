const cityName = document.querySelector("#city");
const button = document.querySelector("#btn");
const currentWeather = document.querySelector("#currentWeather");
const hourly = document.querySelector("#hourlyWeather");
const weekly = document.querySelector("#weeklyWeather");
const extra = document.querySelector("#misc");
const sun = document.querySelector("#sun");
let newHeading;

button.addEventListener("click", () => {
  fetchData();
});

async function fetchData() {
  let city = cityName.value;
  const API_KEY = "9e5fc5ccc80849e6be921941241905";
  const URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7&aqi=yes&alerts=no`;
  let response = await fetch(URL);
  weatherData = await response.json();
  console.log(weatherData);
  currentData(weatherData);
}

let currentData = (weatherData) => {
  if (!weatherData.error) {
    if (newHeading) {
      newHeading.remove();
    }

    currentWeather.style.display = "flex";
    hourly.style.display = "flex";
    weekly.style.display = "flex";
    extra.style.display = "flex";
    sun.style.display = "flex";

    let currentTemp = Math.round(`${weatherData.current.temp_c}`);
    let currentMinTemp = Math.round(
      `${weatherData.forecast.forecastday[0].day.mintemp_c}`
    );
    let currentMaxTemp = Math.round(
      `${weatherData.forecast.forecastday[0].day.maxtemp_c}`
    );
    let airQuality = `${weatherData.current.air_quality["us-epa-index"]}`;

    currentWeather.children[0].innerHTML = `<img src="${weatherData.current.condition.icon}" alt="">`;
    currentWeather.children[1].innerHTML = `${currentTemp}°C`;
    currentWeather.children[2].innerHTML = `${weatherData.current.condition.text}`;
    currentWeather.children[3].innerHTML = `${currentMinTemp}°C / ${currentMaxTemp}°C`;
    switch (airQuality) {
      case "1":
        currentWeather.children[4].innerHTML = `Air Quality : Good`;
        break;
      case "2":
        currentWeather.children[4].innerHTML = `Air Quality : Moderate`;
        break;
      case "3":
        currentWeather.children[4].innerHTML = `Air Quality : Unhealthy for sensitive group`;
        break;
      case "4":
        currentWeather.children[4].innerHTML = `Air Quality : Unhealthy`;
        break;
      case "5":
        currentWeather.children[4].innerHTML = `Air Quality : Very Unhealthy`;
        break;
      case "6":
        currentWeather.children[4].innerHTML = `Air Quality : Hazardous`;
        break;
      default:
        currentWeather.children[4].innerHTML = `Air Quality : Not Available`;
        break;
    }
    hourlyData(weatherData);
  } else {
    newHeading = document.createElement("h2");
    newHeading.innerHTML = `No matching location found. Please try again....`;

    currentWeather.before(newHeading);
    currentWeather.style.display = "none";
    hourly.style.display = "none";
    weekly.style.display = "none";
    extra.style.display = "none";
    sun.style.display = "none";
  }
};

let hourlyData = (weatherData) => {
  for (let i = 0; i < 24; i++) {
    hourly.children[
      i
    ].children[1].innerHTML = `<img src="${weatherData.forecast.forecastday[0].hour[i].condition.icon}" alt="">`;

    let hourlyTemp = Math.round(
      weatherData.forecast.forecastday[0].hour[i].temp_c
    );
    hourly.children[i].children[2].innerHTML = `${hourlyTemp}°C`;
  }
  weeklyData(weatherData);
};

let weeklyData = (weatherData) => {
  for (let i = 0; i < 7; i++) {
    let currentDate = weatherData.forecast.forecastday[i].date;
    weekly.children[i + 1].children[0].innerHTML = `${currentDate.slice(5)}`;

    const weekday = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const d = new Date(currentDate);
    let currentDay = weekday[d.getDay()].slice(0, 3);
    weekly.children[i + 1].children[1].innerHTML = `${currentDay}`;

    let currentIcon = weatherData.forecast.forecastday[i].day.condition.icon;
    weekly.children[
      i + 1
    ].children[2].innerHTML = `<img src="${currentIcon}" alt="">`;

    let currentMin = Math.round(
      weatherData.forecast.forecastday[i].day.mintemp_c
    );
    let currentMax = Math.round(
      weatherData.forecast.forecastday[i].day.maxtemp_c
    );
    weekly.children[
      i + 1
    ].children[3].innerHTML = `${currentMin}°C / ${currentMax}°C`;
  }

  extraData(weatherData);
};

let extraData = (weatherData) => {
  let uvData = weatherData.current.uv;
  if (uvData === 1 || uvData === 2)
    extra.children[0].children[2].innerHTML = `${uvData} Low`;
  else if (uvData >= 3 && uvData <= 5)
    extra.children[0].children[2].innerHTML = `${uvData} Moderate`;
  else if (uvData === 6 || uvData === 7)
    extra.children[0].children[2].innerHTML = `${uvData} High`;
  else if (uvData >= 8 && uvData <= 10)
    extra.children[0].children[2].innerHTML = `${uvData} Very High`;
  else if (uvData >= 11)
    extra.children[0].children[2].innerHTML = `${uvData} Extreme`;

  let feelTemp = Math.round(weatherData.current.feelslike_c);
  extra.children[1].children[2].innerHTML = `${feelTemp}°C`;

  extra.children[2].children[2].innerHTML = `${weatherData.current.humidity}%`;

  extra.children[3].children[2].innerHTML = `${weatherData.current.wind_dir} ${weatherData.current.wind_kph}km/hr`;

  extra.children[4].children[2].innerHTML = `${weatherData.current.pressure_mb}hPa`;

  extra.children[5].children[2].innerHTML = `${weatherData.current.vis_km}km`;

  sunTime(weatherData);
};

let sunTime = (weatherData) => {
  sun.children[0].children[2].innerHTML = `${weatherData.forecast.forecastday[0].astro.sunrise}`;
  sun.children[1].children[2].innerHTML = `${weatherData.forecast.forecastday[0].astro.sunset}`;
};
