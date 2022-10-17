var { lat } = location;
var { lon } = location;
var city = location.name;


var weatherApiKey = "c31022cc13458b2b205f3f52369f4ecc";
var rootUrl = "https://api.openweathermap.org/data/2.5/forecast?&appid=c31022cc13458b2b205f3f52369f4ecc";


// fetch(rootUrl)
// .then(function (res) {
//     return res.json();  
//   })
//   .then(function (data) {
//     renderItems(city, data);
//   })
//   .catch(function (err) {
//     console.error(err);
//   });
// console.log(rootUrl)

var searchArea = document.querySelector("#search-input")
var searchBtn = document.querySelector("#search-button")
var weatherCard = document.querySelector("#forecast1")

searchBtn.addEventListener('click', function(){
    fetch("https://api.openweathermap.org/data/2.5/forcast?" + searchArea.value + "&appid=c31022cc13458b2b205f3f52369f4ecc")
    .then(response => response.json())
    .then(data => console.log(data))

    .catch(err => alert("city not found"))
})