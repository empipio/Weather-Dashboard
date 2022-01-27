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

var searchedCities = [];

//icon/temp/humidity/wind speed/uv index

function renderButtons() {
  var savedCities = JSON.parse(localStorage.getItem("cities"));
  // for (var i = 0; i < savedCities.length; i++) {
  //   var listButtonEl = document.getElementById("saved-cities");
  //   var nameEl = document.createElement("li");
  //   var buttonEl = document.createElement("button");
  //   buttonEl[i].innertext = searchedCities[i].value;
  //   nameEl[i].appendchild(buttonEl[i]);
  //   listButtonEl.appendChild(nameEl);
  // }
}

function saveResults() {
  var searchTerm = searchFormEl.value.trim();
  searchedCities.push(searchTerm);
  localStorage.setItem("cities", JSON.stringify(searchedCities));
  renderButtons();
}

function getWeather() {
  console.log("you clicked a button");
  var city = searchFormEl.value.trim();

  var coordURL =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=1&appid=" +
    APIKey;

  if (city.length > 0) {
    fetch(coordURL)
      .then(function (res) {
        return res.json();
      })
      .then(function (city) {
        var latitude = city[0].lat;
        var longitude = city[0].lon;
        var queryURL =
          "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          latitude +
          "&lon=" +
          longitude +
          "&exclude=minutely,hourly&appid=" +
          APIKey;

        fetch(queryURL)
          .then(function (res) {
            return res.json();
          })
          .then(function (city) {
            var cityNameEl = document.getElementById("city-name");
            cityNameEl.textContent = searchFormEl.value;
            var todaysDateEl = document.getElementById("date");
            todaysDateEl.textContent = moment().format("MMM Do, YYYY");
            var conditionsArr = [
              city.current.weather[0].icon,
              city.current.wind_speed,
              city.current.humidity,
              city.current.temp,
              city.current.uvi,
            ];
            console.log(conditionsArr);
            var headerArr = [
              "Today will be: ",
              "Wind Speed: ",
              "Humidity: ",
              "Temperature: ",
              "UVI index: ",
            ];
            // for (var i = 0; i < headerArr.length; i++) {
            //   var conditionEl = document.createElement("li");
            //   conditionEl[i] = headerArr[i] + conditionsArr[i]; //conditionEl[i].value or textcontent doesn't work!
            // todaysDateEl.appendChild(conditionEl[i]);
            //  }
          });
      });
  } else {
    alert("Please enter a city");
  }
  saveResults();
}

renderButtons();
searchButtonEl.addEventListener("click", getWeather);
