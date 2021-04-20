
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
  let date = document.querySelector(".Location_info .date");
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
    temperature = Math.round(response.data.main.temp);
    let icon=response.data.weather[0].icon;
    let timestamp=response.data.dt;
    let humidity = response.data.main.humidity;
    let windSpeed = response.data.wind.speed;
    let description = response.data.weather[0].description;
    showWeather(temperature, humidity, windSpeed, description, icon);
    formateDate(timestamp*1000);
    getForecast(response.data.coord);
    
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
    getCurrentForecast(position.coords);
  });
}
function showCity(city) {
  let h3 = document.querySelector(".Location_info h3");
  h3.innerHTML = city;
}

function weekDay(timestamp){
  let now = new Date(timestamp*1000);
  var weekdays = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
  ];
  var day = now.getDay();

  return weekdays[day];
}


function displayForecast(response){
  //console.log(response.data);
 
  let forecastElement=document.querySelector("#sevenDayForcast");
  let forecastHTML=`<h2>Seven Day Forecast</h2> <div class="row">`;
  let hourly=response.data.hourly;
  displayHourlyTrend(hourly);
  let date=response.data.daily;
  date.forEach(function(forecastDay, index){
  if (index<7){
    forecastHTML=forecastHTML+`
  <div class="col">
   <h2 class="weekday">${weekDay(forecastDay.dt)}</h2>
    <img class="weatherImg" src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png" />
      <p class="description">${forecastDay.weather[0].description}</p>
      <p class="degree">${Math.round(forecastDay.temp.max)}℃/${Math.round(forecastDay.temp.min)}℃</p>
        <img
          class="windImg"
          src="https://ssl.gstatic.com/m/images/weather/wind_unselected.svg"
          style="
                transform-origin: 50% 50%;
                transform: rotate(${forecastDay.wind_deg}deg);
                width: 24px;"/>
   </div>`;}
  })
  forecastHTML=forecastHTML+`</div>`
  forecastElement.innerHTML=forecastHTML;
  hourForecast(response.data);
}

function getCurrentForecast(coordinates){
  let apiUrl=`https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function getForecast(coordinates){
  let apiUrl=`https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

search("Sydney")

function search(city){

  displayTemperature(city);
  showCity(city);}


function formateTime(timestamp){
  let now = new Date(timestamp*1000);
  
  var time = now.getHours();
  if (time >=12) {
    time = time+"pm";
  }
  else if(time<10){
    time='0'.concat(time)+"am";}
  else{
    time=time+"am";
  }
  
  return `${time}` ;
}

var width=500;
var height=100;
var margin = ({top: 20, right: 30, bottom: 30, left: 40})

  
function displayHourlyTrend(data){

  let display=document.querySelector(".temperaturesvg");

  x=d3.scaleUtc()
     .domain(d3.extent(data.slice(0,24), d=>d.dt))
     .range([0, width])

  y=d3.scaleLinear()
     .domain([0, d3.max(data.slice(0,24), d=>d.temp)])
     .range([height,0])

  line=d3.line()
      .x(d=>x(d.dt))
      .y(d=>y(d.temp))

  area=d3.area()
      .x(d=>x(d.dt))
      .y0(d=>y(d.temp))
      .y1(y(5))

  xAxis = (g, scale=x) => g
    .attr("transform", `translate(0,${height-margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
  
  yAxis = (g, scale=y) => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(height / 40))
    .call(g => g.select(".domain").remove())
  
  display.innerHTML=
  `<svg viewBox="0 -5 ${width} ${height}">
  <path d="${line(data)}" fill="none" stroke="blue" stroke-width="1.5" stroke-miterlimit="1"></path>
  <text x="0" y="5" fill="black" font-size="0.5em">${d3.max(data, d=>d.temp)}℃</text>
  <text x="0" y="90" fill="black" font-size="0.5em">${formateTime(data[0].dt)}</text>
  <text x="125" y="90" fill="black" font-size="0.5em">${formateTime(data[5].dt)}</text>
  <text x="250" y="90" fill="black" font-size="0.5em">${formateTime(data[11].dt)}</text>
  <text x="375" y="90" fill="black" font-size="0.5em">${formateTime(data[17].dt)}</text>
  <text x="480" y="90" fill="black" font-size="0.5em">${formateTime(data[23].dt)}</text>
</svg>`
  
    
}
 function hourForecast(data){
   let Location=document.querySelectorAll(".SevenDayDetails .Location_info h3");
   let time=document.querySelectorAll(".SevenDayDetails .Location_info .date");
   let description=document.querySelectorAll(".SevenDayDetails .Location_info .description");

   Location.forEach(function(loc){
     loc.innerHTML=data.timezone;
   })
   time.forEach(function(t){
     t.innerHTML=formateTime(data.current.dt);
   })
   description.forEach(function(d){
     d.innerHTML=data.current.weather[0].description;
   })

  display48Temperature(data.hourly);
  display48Humidity(data.hourly);
  display48Wind(data.hourly);
 }

 function display48Temperature(data){
    let displayTemperature=document.querySelector(".SevenDayTemperature");

    x=d3.scaleUtc()
     .domain(d3.extent(data, d=>d.dt))
     .range([0, width])

    y=d3.scaleLinear()
     .domain([0, d3.max(data, d=>d.temp)])
     .range([height,0])

    line=d3.line()
      .x(d=>x(d.dt))
      .y(d=>y(d.temp))

    area1=d3.area()
      .x(d=>x(d.dt))
      .y0(d=>y(d.temp))
      .y1(y(5))

  
    xAxis = (g, scale=x) => g
      .attr("transform", `translate(0,${height-margin.bottom})`)
      .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
  
    yAxis = (g, scale=y) => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(height / 40))
      .call(g => g.select(".domain").remove())

  
    displayTemperature.innerHTML=
    `<svg viewBox="0 -5 ${width} ${height}">
     <path d="${line(data)}" fill="none" stroke="blue" stroke-width="1.5" stroke-miterlimit="1"></path>
     <text x="0" y="5" fill="black" font-size="0.5em">${d3.max(data, d=>d.temp)}℃</text>
     <text x="0" y="90" fill="black" font-size="0.5em">${formateTime(data[0].dt)}</text>
     <text x="125" y="90" fill="black" font-size="0.5em">${formateTime(data[11].dt)}</text>
     <text x="250" y="90" fill="black" font-size="0.5em">${formateTime(data[23].dt)}</text>
     <text x="375" y="90" fill="black" font-size="0.5em">${formateTime(data[35].dt)}</text>
    <text x="480" y="90" fill="black" font-size="0.5em">${formateTime(data[47].dt)}</text>
   </svg>`

    
 }

 function display48Humidity(data){
    let displayHumidity=document.querySelector(".SevenDayPreciptation");

     x=d3.scaleUtc()
     .domain(d3.extent(data, d=>d.dt))
     .range([0, width])

    
    y=d3.scaleLinear()
     .domain([0, d3.max(data, d=>d.humidity)])
     .range([height,0])
    
    line=d3.line()
      .x(d=>x(d.dt))
      .y(d=>y(d.humidity))

    area2=d3.area()
      .x(d=>x(d.dt))
      .y0(d=>y(d.humidity))
      .y1(y(15))

    displayHumidity.innerHTML=
    `<svg viewBox="0 -5 ${width} ${height}">
     <path d="${line(data)}" fill="none" stroke="blue" stroke-width="1.5" stroke-miterlimit="1"></path>
     <text x="0" y="5" fill="black" font-size="0.5em">${d3.max(data, d=>d.humidity)}%</text>
     <text x="0" y="90" fill="black" font-size="0.5em">${formateTime(data[0].dt)}</text>
     <text x="125" y="90" fill="black" font-size="0.5em">${formateTime(data[11].dt)}</text>
     <text x="250" y="90" fill="black" font-size="0.5em">${formateTime(data[23].dt)}</text>
     <text x="375" y="90" fill="black" font-size="0.5em">${formateTime(data[35].dt)}</text>
    <text x="480" y="90" fill="black" font-size="0.5em">${formateTime(data[47].dt)}</text>
   </svg>`

 }

 function display48Wind(data){
   let displayWind=document.querySelectorAll(".SevenDayWind .card");
   displayWind.forEach(function(w, index){
     Img=w.querySelector("img");
     var i=index*5;
     Img.outerHTML=`<img
                  class="windImg"
                  src="https://ssl.gstatic.com/m/images/weather/wind_unselected.svg"
                  style="
                    transform-origin: 50% 50%;
                    transform: rotate(${data[i].wind_deg}deg);
                    width: 24px;
                  "
                />`
     time=w.querySelector("p");
     time.innerHTML=formateTime(data[i].dt);
   }

   )
 }