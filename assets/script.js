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

function renderButtons() {
  var savedCities = JSON.parse(localStorage.getItem("cities"));
  if (savedCities !== null) {
    for (var i = 0; i < savedCities.length; i++) {
      var listButtonEl = document.getElementById("saved-cities");
      var nameEl = document.createElement("li");
      var buttonEl = document.createElement("button");
      buttonEl.innerText = savedCities[i];
      buttonEl.setAttribute("class", "searchedButtons");
      nameEl.append(buttonEl);
      listButtonEl.append(nameEl);
    }
    searchedCities = savedCities;
  }
}

function saveResults(searchTerm) {
  //checks searchedCities array to see if searchTerm is already present
  if (!searchedCities.includes(searchTerm)) {
    searchedCities.push(searchTerm);
    localStorage.setItem("cities", JSON.stringify(searchedCities));

    var listButtonEl = document.getElementById("saved-cities");
    var nameEl = document.createElement("li");
    var buttonEl = document.createElement("button");
    buttonEl.innerText = searchTerm;
    buttonEl.setAttribute("class", "searchedButtons");
    nameEl.append(buttonEl);
    listButtonEl.append(nameEl);
    buttonEl.addEventListener("click", getWeather);
  }
}

function getWeather(event) {
  var citySearch = null;

  if (searchFormEl.value === "") {
    citySearch = event.target.innerText;
  } else {
    citySearch = searchFormEl.value.trim();
  }
  saveResults(citySearch);

  var coordURL =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    citySearch +
    "&limit=1&appid=" +
    APIKey;

  if (citySearch.length > 0) {
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
            cityNameEl.textContent = citySearch;
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
              "Temperature: " +
              (city.current.temp - 273.15).toFixed(0) +
              " degrees Celcius";
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

            var resultsArea = document.getElementById("5-day-forecast");
            resultsArea.innerHTML = "";
            //starting for loop at 1 as index position 0 is current day already displayed
            for (var i = 1; i <= 5; i++) {
              var resultCard = document.createElement("div");
              resultCard.classList.add("card");

              var resultBody = document.createElement("div");
              resultBody.classList.add("card-body");
              resultCard.append(resultBody);

              var dailyDate = moment.unix(city.daily[i].dt);
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
                "Temperature: " +
                (city.daily[i].temp.day - 273.15).toFixed(0) +
                " degrees Celcius";
              resultBody.append(temperature);

              resultsArea.append(resultCard);
            }
            //clear the searched city
            searchFormEl.value = "";
          });
      });
  } else {
    alert("Please enter a city");
  }
}

var previousSearches = document.getElementsByClassName("searchedButtons");

renderButtons();
searchButtonEl.addEventListener("click", getWeather);

for (var i = 0; i < previousSearches.length; i++) {
  previousSearches[i].addEventListener("click", getWeather);
}
