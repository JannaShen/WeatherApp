
//function searchCities(searchedcity, o) {
//  var recordedCity;
//  for (recordedCity in o) {
 //   if (searchedcity === recordedCity) {
  //    return o[recordedCity];
 //   }
 // }
 // return null;
//}
//let city = prompt("Enter a city") || "";
//let result = searchCities(city.trim().toLowerCase(), weather);
//if (result === null) {
// alert(
//   `Sorry, we don't know the weather for this city, try going to https://www.google.com/search?q=weather+${city
//     .trim()
//      .toLowerCase()}`
// );
//} else {
//  let fanrenhite = changeTemperature(result.temp);
// alert(
//   `It is currently ${
//    result.temp
//   }°C (${fanrenhite}°F) in ${city.trim().toLowerCase()} with a humidity of ${
//     result.humidity
//   }%`
// );
//}

function formateDate(timestamp) {
  let date = document.querySelector(".today_card .date");
  let now = new Date(timestamp);
  var weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  var day = now.getDay();
  var time = now.getHours();
  if (time < 10) {
    time = "0".concat(time);
  }
  var minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = "0".concat(minutes);
  }
  date.innerHTML = `${weekdays[day]}, ${time}:${minutes}`;
}

let button = document.querySelector(".searchEngine button");
button.addEventListener("click", searchCity);

function searchCity(event) {
  event.preventDefault();
  let city = document.querySelector("input#csearch").value;
  let h3 = document.querySelector(".Location_info h3");
  if (city) {
    displayTemperature(city);
    h3.innerHTML = city;
  } else {
    alert("Please enter city name to search");
  }
  
}
let temperature=null;
//searchEngine
let apiKey = "6f079a1be79afa8a42b66a1d232d91dd";
function displayTemperature(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(function (response) {
    console.log(response); //fetch api responses
    //console.log(response.data.main.temp); //fetch temperature
    temperature = response.data.main.temp;
    let icon=response.data.weather[0].icon;
    let timestamp=response.data.dt;
    let humidity = response.data.main.humidity;
    let windSpeed = response.data.wind.speed;
    let description = response.data.weather[0].description;
    showWeather(temperature, humidity, windSpeed, description, icon);
    formateDate(timestamp*1000);
  });
}

function showWeather(temperature, humidity, windSpeed, description, icon) {
  let celciusShow = document.querySelector("h2 strong");
  celciusShow.innerHTML = temperature;
  let humidityShow = document.querySelector("p.Humidity");
  humidityShow.innerHTML = `Humidity: ${humidity}%`;
  let windShow = document.querySelector("p.Wind");
  windShow.innerHTML = `Wind: ${windSpeed} km/h`;
  let descriptionShow = document.querySelector("p.description");
  descriptionShow.innerHTML = description;
  let iconShow=document.querySelector('.weatherImg img');
  iconShow.setAttribute("src", `http://openweathermap.org/img/wn/${icon}@2x.png`)
}

let celciusDegree = document.querySelector("#celsius");
celciusDegree.addEventListener("click", changeCelcius);

let fanrenhiteDegree = document.querySelector("#fahrenheit");
fanrenhiteDegree.addEventListener("click", changeFanrenhite);

function covertFarenhite(degree) {
  let Fanrenhite = (degree * 9) / 5 + 32;
  return Math.round(Fanrenhite);
}
function changeFanrenhite(event) {
  event.preventDefault();
  celciusDegree.classList.add("active");
  fanrenhiteDegree.classList.remove("active");
  let fanrenhite = covertFarenhite(temperature);
  let display = document.querySelector("h2 strong");
  display.innerHTML = fanrenhite;
}

function changeCelcius(event) {
  event.preventDefault();
  celciusDegree.classList.remove("active");
  fanrenhiteDegree.classList.add("active");
  let display = document.querySelector("h2 strong");
  display.innerHTML = temperature;
}

let currentButton = document.querySelector(".searchEngine .currentLocation");
currentButton.addEventListener("click", getLocation);

function getLocation() {
  navigator.geolocation.getCurrentPosition(showPosition);
}
function showPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(function (response) {
    //console.log(response); //fetch api responses
    //console.log(response.data.main.temp); //fetch temperature
    temperature = response.data.main.temp;
    let icon=response.data.weather[0].icon;
    let timestamp=response.data.dt;
    let city = response.data.name;
    let humidity = response.data.main.humidity;
    let windSpeed = response.data.wind.speed;
    let description = response.data.weather[0].description;
    showWeather(temperature, humidity, windSpeed, description, icon);
    showCity(city);
    formateDate(timestamp*1000);
  });
}
function showCity(city) {
  let h3 = document.querySelector(".Location_info h3");
  h3.innerHTML = city;
}

function displayForecast(){
  let forecastElement=document.querySelector("#sevenDayForcast");
  let forecastHTML=`<div class="row">`;
  let date=["sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
  date.forEach(function(day){
    forecastHTML=forecastHTML+`
  <div class="col">
   <h2 class="weekday">Tue(Today)</h2>
    <img class="weatherImg" src="src/partly_cloudy.png" />
      <p class="description">Partly Cloudy</p>
      <p class="degree">25℃/18℃</p>
        <img
          class="windImg"
          src="src/wind_unselected.svg"
          style="
                transform-origin: 50% 50%;
                transform: rotate(179deg);
                width: 24px;"/>
   </div>`;
  })
  forecastHTML=forecastHTML+`</div>`
  forecastElement.innerHTML=forecastHTML;
}
displayForecast();