// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history

// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity,
// the wind speed, and the UV index

// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe

// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature,
// the wind speed, and the humidity

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
  if (savedCities !== null) {
    for (var i = 0; i < savedCities.length; i++) {
      var listButtonEl = document.getElementById("saved-cities");
      var nameEl = document.createElement("li");
      var buttonEl = document.createElement("button");
      buttonEl.innerText = savedCities[i];
      nameEl.append(buttonEl);
      listButtonEl.append(nameEl);
    }
  }
}

function saveResults() {
  var searchTerm = searchFormEl.value.trim();
  searchedCities.push(searchTerm);
  localStorage.setItem("cities", JSON.stringify(searchedCities));
  //brings everything out of LS every time another search occurs when not commented out
  //when commented out, only brings out what you searched for last time but updated only when refreshed
  //renderButtons();
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
            var divElTwo = document.createElement("div");
            todaysDateEl.append(divElTwo);

            var todayEl = document.createElement("li");
            var todayLabel = document.createElement("p");
            todayLabel.innerText = "Today will be: ";
            todayEl.append(todayLabel);

            var todayIcon = document.createElement("img");
            todayIcon.setAttribute(
              "src",
              `http://openweathermap.org/img/wn/${city.current.weather[0].icon}@2x.png`
            );
            todayEl.append(todayIcon);
            todaysDateEl.append(todayEl);

            var windEl = document.createElement("li");
            windEl.innerText =
              "Wind speed: " + city.current.wind_speed + " MPH";
            todaysDateEl.append(windEl);

            var humidityEl = document.createElement("li");
            humidityEl.innerText = "Humidity: " + city.current.humidity + " %";
            todaysDateEl.append(humidityEl);

            var temperatureEl = document.createElement("li");
            temperatureEl.innerText =
              "Temperature: " + city.current.temp + " degrees";
            todaysDateEl.append(temperatureEl);

            var uvContainer = document.createElement("li");
            var uvBox = document.createElement("div");
            var uvText = document.createElement("p");
            uvText.innerText = "UV index: " + city.current.uvi;
            uvText.setAttribute("style", "color: white");
            if (city.current.uvi < 3) {
              uvBox.setAttribute("style", "background-color: green");
            } else if (city.current.uvi < 7) {
              uvBox.setAttribute("style", "background-color: orange");
            } else {
              uvBox.setAttribute("style", "background-color: red");
            }
            uvBox.append(uvText);
            uvContainer.append(uvBox);
            todaysDateEl.append(uvContainer);

            //5 DAY STUFF BELOW NOT YET FINISHED

            //for 5 day forecast (in daily array this is positions 1-5 and is timestamped-convert back for date?)
            //get relevant info from api
            //date, icon, temperature, windspeed, humidity
            //for loop, make a card for each day and render info to each
            //colour code UV index

            var resultsArea = document.getElementById("5-day-forecast");
            //starting for loop at 1 as index position 0 is current day already displayed
            for (var i = 1; i <= 5; i++) {
              var resultCard = document.createElement("div");
              resultCard.classList.add("card");

              var resultBody = document.createElement("div");
              resultBody.classList.add("card-body");
              resultCard.append(resultBody);

              var dailyDate = moment(city.daily[i].dt);
              console.log(dailyDate);

              var formattedDate = dailyDate.format("dddd, MMMM Do");

              var titleEl = document.createElement("h4");
              titleEl.textContent = formattedDate;
              resultBody.append(titleEl);

              var iconImage = document.createElement("img");
              iconImage.setAttribute(
                "src",
                `http://openweathermap.org/img/wn/${city.daily[i].weather[0].icon}@2x.png`
              );
              resultBody.append(iconImage);

              var windSpeed = document.createElement("div");
              windSpeed.innerText =
                "Wind speed: " + city.daily[i].wind_speed + " MPH";
              resultBody.append(windSpeed);

              var humidity = document.createElement("div");
              humidity.innerText = "Humidity: " + city.daily[i].humidity + " %";
              resultBody.append(humidity);

              var temperature = document.createElement("div");
              temperature.innerText =
                "Temperature: " + city.daily[i].temp.day + " degrees";
              resultBody.append(temperature);

              resultsArea.append(resultCard);
            }

            // var forecastHeaders = [
            //   "Date: ",
            //   "The weather will be: ",
            //   "Temperature: ",
            //   "Wind Speed: ",
            //   "Humidity: ",
            // ];

            // for (var i = 1; i < forecastHeaders.length; i++) {
            //   var forecastArr = [
            //     city.daily[i].dt,
            //     city.daily[i].weather[0].icon,
            //     city.daily[i].temp.day,
            //     city.daily[i].wind_speed,
            //     city.daily[i].humidity,
            //   ];
            //   //how to put all the info on each card? two loops? nest them?

            //   var resultCard = document.createElement("div");
            //   resultCard.classList.add("card");
            //   resultsArea.append(resultCard);

            //   var resultBody = document.createElement("div");
            //   resultBody.classList.add("card-body");
            //   resultCard.append(resultBody);
            //   for (var i = 1; i < forecastHeaders.length; i++) {
            //     var titleEl = document.createElement("ul");
            //     titleEl.textContent = city.daily[i].dt;
            //     resultBody.append(titleEl);

            //     var forecastInfo = document.createElement("li");
            //     forecastInfo.textContent = forecastHeaders[i] + forecastArr[i];
            //     resultBody.append(forecastInfo);
            //   }
            // }
          });
      });
  } else {
    alert("Please enter a city");
  }
  saveResults();
}

renderButtons();
searchButtonEl.addEventListener("click", getWeather);

//put event listeners on buttons for previous cities-set attributes?
