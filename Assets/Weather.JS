
var searchHistory =[];
var weatherApiKey = "c31022cc13458b2b205f3f52369f4ecc";
var rootUrl = "https://api.openweathermap.org/";

var searchForm = document.querySelector("#search-form");
var searchInput = document.querySelector("#search-input");
var todayContainer = document.querySelector("#today");
var forecastContainer = document.querySelector("#forecast");
var searchHistoryContainer = document.querySelector("#history");

dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

function renderSearch(){
  searchHistoryContainer.innerHTML = "";
  for(var i = searchHistory.length - 1; i >= 0; i--) {
    var btn = document.createElement("button");
    btn.setAttribute("type","button"); 
    btn.setAttribute("aria-controls", "today forecast");
    btn.classList.add("history-btn", "btn-history");
    btn.setAttribute("data-search", searchHistory[i]);
    btn.textContent = searchHistory[i];
    searchHistoryContainer.append(btn)
  }
};

function setHistory(search){
  if(searchHistory.indexOf(search)!== -1){
    return;
  }
   searchHistory.push(search);
   localStorage.setItem("search-history", JSON.stringify(searchHistory));
   renderSearch()
}

function getHistory(){
  var storedHistory = localStorage.getItem("search-history");
  if(storedHistory){
    searchHistory = JSON.parse(storedHistory);
  }
    renderSearch()
}

function rendercurrentweather(city, weather){
  var date = dayjs().format("M/D/YYYY");
  var temp = weather.main.temp;
  var wind = weather.wind.speed;
  var humidity = weather.main.humidity;
  var iconurl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;

  var card = document.createElement("div");
  var cardbody = document.createElement("div");
  var heading = document.createElement("h2");
  var weathericon = document.createElement("img");
  var tempEl = document.createElement("p");
  var windEl = document.createElement("p");
  var humidityEl = document.createElement("p");

  card.setAttribute("class","card");
  cardbody.setAttribute("class","card-body");
  card.append(cardbody);

  heading.setAttribute("class", "card-title");
  tempEl.setAttribute("class", "card-text");
  windEl.setAttribute("class", "card-text");
  humidityEl.setAttribute("class", "card-text");

  heading.textContent = `${city} ${date}`;
  weathericon.setAttribute("src", iconurl);
  weathericon.setAttribute("class", "weather-img");
  heading.append(weathericon);
  
  tempEl.textContent = `Temp: ${temp}F`;
  windEl.textContent = `Wind: ${wind}mph`;
  humidityEl.textContent = `Humidity: ${humidity}%`;

  cardbody.append(heading, tempEl, windEl, humidityEl);
  todayContainer.innerHTML = "";
  todayContainer.append(card);

}

  function renderForecastCard(forecast){
    var iconurl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
    var temp = forecast.main.temp;
    var wind = forecast.wind.speed;
    var humidity = forecast.main.humidity;

    var column = document.createElement("div");
    var card = document.createElement("div");
    var cardbody = document.createElement("div");
    var cardTitle = document.createElement("h5");
    var weathericon = document.createElement("img");
    var tempEl = document.createElement("p");
    var windEl = document.createElement("p");
    var humidityEl = document.createElement("p");

    column.append(card);
    card.append(cardbody);
    cardbody.append(cardTitle, weathericon, tempEl, windEl, humidityEl);

    column.setAttribute("class", "col-md five-day-card");
    card.setAttribute("class","card bg-primary h-100 text-white");
    cardbody.setAttribute("class", "card-body p-2");
    cardTitle.setAttribute("class", "card-title");
    tempEl.setAttribute("class", "card-text");
    windEl.setAttribute("class", "card-text");
    humidityEl.setAttribute("class", "card-text");

    cardTitle.textContent = dayjs(forecast.dt_txt).format("M/D/YYYY");
    weathericon.setAttribute("src", iconurl);

    tempEl.textContent = `Temp: ${temp}F`;
    windEl.textContent = `Wind: ${wind}mph`;
    humidityEl.textContent = `Humidity: ${humidity}%`;
  
    forecastContainer.append("column");
  }

  function renderforecast(dailyForecast){
    var start = dayjs().add(1,"day").startOf("day").unix();
    var end = dayjs().add(6,"day").startOf("day").unix();

    var headingColumn = document.createElement("div");
    var heading = document.createElement("h4");

    forecastContainer.innerHTML = "";
    forecastContainer.append(headingColumn);

    for(var i = 0; i < dailyForecast.length; i++){
      if(dailyForecast[i].dt >= start && dailyForecast[i].dt < end) {
        if(dailyForecast[i].dt_txt.slice(11,13) == "12") {
          renderForecastCard(dailyForecast[i])
        }
      }
    }
  }

function renderItems(city, data){
   rendercurrentweather(city, data.list[0], data.city.timezone0);
   renderforecast(data.list);
}

function fetchWeather(location) {
  var { lat } = location;
  var { lon } = location;
  var city = location.name;

  var apiUrl =`https://api.openweathermap.org/data/2.5/forecast?&zip=06488&lat=${lat}&lon=${lon}&units=imperial&appid=${weatherApiKey}`

  fetch(apiUrl)
    .then(function (res) {
      return res.json();  
    })
    .then(function (data) {
      renderItems(city, data);
    })
    .catch(function (err) {
      console.error(err);
    });
} console.log(fetchWeather(location))



function fetchCoords(search) {
  var apiUrl = `${weatherApiRootUrl}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherApiKey}`;

  fetch(apiUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (!data[0]) {
        alert('Location not found'); 
      } else {
        appendToHistory(search);
        fetchWeather(data[0]);
      }
    })
    .catch(function (err) {
      console.error(err);
    });
}

function handleSearchSubmit(e){
    if(!searchInput.value){
      return;
    }
    e.preventDefault();
    var search = searchInput.value.trim();
    fetchCoords(search);
    searchInput.value = "";
}

function handleSearchHistoryClick(e) {
  // Don't do search if current elements is not a search history button
  if (!e.target.matches('.btn-history')) {
    return;
  }

  var btn = e.target;
  var search = btn.getAttribute('data-search');
  fetchCoords(search);
}

function handleSearchHistoryClick(e) {
  // Don't do search if current elements is not a search history button
  if (!e.target.matches('.btn-history')) {
    return;
  }

  var btn = e.target;
  var search = btn.getAttribute('data-search');
  fetchCoords(search);
}

initSearchHistory();
searchForm.addEventListener('submit', handleSearchFormSubmit);
searchHistoryContainer.addEventListener('click', handleSearchHistoryClick);



// Tried Code//

//------------------------------------------------------------------------------------
// const options = {
// 	method: 'GET',
// 	headers: {
// 		'X-RapidAPI-Key': 'ddebcb2ceamsh1919faa5a84d055p10d063jsneee465e9522e',
// 		'X-RapidAPI-Host': 'open-weather13.p.rapidapi.com'
// 	}
// };

// fetch('https://open-weather13.p.rapidapi.com/city/New York', options)
// 	.then(response => response.json())
// 	.then(response => console.log(response))
// 	.catch(err => console.error(err));


// fetch(requestUrl)
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (data) {
//     console.log("Weather Time");
//     for (var i = 0; i < data.length; i++) {
//       console.log(data[i].requestUrl);
//     }
//   });

//fetch ("api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid=c31022cc13458b2b205f3f52369f4ecc") 
// .then(response => {
//   return response.json();
// }) 
//  .then(function (data) {
//     console.log('Want to know the Forecast');
//     console.log(data);
//  
// $.ajax({
//   url:requestUrl,
//   method: 'GET',
// }).then(function (response) {
//   console.log('Weather in Your Area is');
//   console.log(response);
// });
