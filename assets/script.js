// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history

// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity,
//the wind speed, and the UV index

// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe

// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature,
//the wind speed, and the humidity

// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

//fetch() today and next 5 days from open weather api
//render info to page
//today: name/date/icon/temp/humidity/wind speed/uv index
//save searched city to local storage
//allocate colour to uv index
//5-day: date/icon/temp/wind speed/humidity
//searched cities saved to page and when clicked on provide same info as when typed in
//event listener to search button

var APIKey = "6d7c456cdcc4e591b5b2b1dbebe8682b";

var searchFormEl = document.getElementById("search-input");

var searchButtonEl = document.getElementById("search-btn");

function getWeather() {
  var city = searchFormEl.value.trim();
  var queryURL =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    APIKey;
  if (city.length > 0) {
    fetch(queryURL)
      .then(function (res) {
        return res.json();
      })
      .then(function (city) {
        console.log(city);
      });
  } else {
    alert("Please enter a city");
  }
}

// //this appears as unauthorised?
// fetch(
//   "http://api.openweathermap.org/data/2.5/weather?q=London&appid=6d7c456cdcc4e591b5b2b1dbebe8682b"
// ).then(function (res) {
//   return res.json();
// });

searchButtonEl.addEventListener("click", getWeather);
