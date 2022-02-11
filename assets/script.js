const APIKey = "6d7c456cdcc4e591b5b2b1dbebe8682b";

//variables declared for search field
const searchFormEl = document.getElementById("search-input");

const searchButtonEl = document.getElementById("search-btn");

//empty array in which to store cities previously searched for
let searchedCities = [];

//renders buttons to screen of cities previously searched for
function renderButtons() {
  const savedCities = JSON.parse(localStorage.getItem("cities"));
  if (savedCities !== null) {
    for (let i = 0; i < savedCities.length; i++) {
      const listButtonEl = document.getElementById("saved-cities");
      const nameEl = document.createElement("li");
      const buttonEl = document.createElement("button");
      buttonEl.innerText = savedCities[i];
      buttonEl.setAttribute("class", "searchedButtons");
      nameEl.append(buttonEl);
      listButtonEl.append(nameEl);
    }
    //updates array
    searchedCities = savedCities;
  }
}

//saves city search to local storage and creates button
function saveResults(searchTerm) {
  //checks searchedCities array to see if searchTerm is already present
  if (!searchedCities.includes(searchTerm)) {
    searchedCities.push(searchTerm);
    localStorage.setItem("cities", JSON.stringify(searchedCities));

    const listButtonEl = document.getElementById("saved-cities");
    const nameEl = document.createElement("li");
    const buttonEl = document.createElement("button");
    buttonEl.innerText = searchTerm;
    buttonEl.setAttribute("class", "searchedButtons");
    nameEl.append(buttonEl);
    listButtonEl.append(nameEl);
    buttonEl.addEventListener("click", getWeather);
  }
}

function getWeather(event) {
  let citySearch = null;

  //if nothing present in search bar, check for clicks on previous city buttons
  if (searchFormEl.value === "") {
    citySearch = event.target.innerText;
  } else {
    citySearch = searchFormEl.value.trim();
  }
  saveResults(citySearch);

  //get coordinates of city
  const coordURL =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    citySearch +
    "&limit=1&appid=" +
    APIKey;

  //use one call api to get forecast using coordinates
  if (citySearch.length > 0) {
    fetch(coordURL)
      .then(function (res) {
        return res.json();
      })
      .then(function (city) {
        const latitude = city[0].lat;
        const longitude = city[0].lon;
        const queryURL =
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
            //CURRENT DAY FORECAST
            //create html elements to display results
            const cityNameEl = document.getElementById("city-name");
            cityNameEl.textContent = citySearch;
            const todaysDateEl = document.getElementById("date");
            todaysDateEl.textContent = moment().format("MMM Do, YYYY");
            const divElTwo = document.createElement("div");
            todaysDateEl.append(divElTwo);

            const todayEl = document.createElement("li");
            const todayLabel = document.createElement("p");
            todayLabel.innerText = "Today will be: ";
            todayEl.append(todayLabel);

            const todayIcon = document.createElement("img");
            todayIcon.setAttribute(
              "src",
              `https://openweathermap.org/img/wn/${city.current.weather[0].icon}@2x.png`
            );
            todayEl.append(todayIcon);
            todaysDateEl.append(todayEl);

            const windEl = document.createElement("li");
            windEl.innerText =
              "Wind speed: " + city.current.wind_speed + " MPH";
            todaysDateEl.append(windEl);

            const humidityEl = document.createElement("li");
            humidityEl.innerText = "Humidity: " + city.current.humidity + " %";
            todaysDateEl.append(humidityEl);

            const temperatureEl = document.createElement("li");
            //convert temperature from kelvin to celcius
            temperatureEl.innerText =
              "Temperature: " +
              (city.current.temp - 273.15).toFixed(0) +
              " degrees Celcius";
            todaysDateEl.append(temperatureEl);

            const uvContainer = document.createElement("li");
            const uvBox = document.createElement("div");
            const uvText = document.createElement("p");
            uvText.innerText = "UV index: " + city.current.uvi;
            uvText.setAttribute("style", "color: white");
            //conditional statements to allocate colour according to uv index
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

            //5 DAY FORECAST
            const resultsArea = document.getElementById("5-day-forecast");
            //clear results area from previous search
            resultsArea.innerHTML = "";
            //starting for loop at 1 as index position 0 is current day already displayed
            for (let i = 1; i <= 5; i++) {
              //create html elements to display 5 day forecast
              const resultCard = document.createElement("div");
              resultCard.classList.add("card");

              const resultBody = document.createElement("div");
              resultBody.classList.add("card-body");
              resultCard.append(resultBody);

              const dailyDate = moment.unix(city.daily[i].dt);

              const formattedDate = dailyDate.format("dddd, MMMM Do");

              const titleEl = document.createElement("h4");
              titleEl.textContent = formattedDate;
              resultBody.append(titleEl);

              const iconImage = document.createElement("img");
              iconImage.setAttribute(
                "src",
                `https://openweathermap.org/img/wn/${city.daily[i].weather[0].icon}@2x.png`
              );
              resultBody.append(iconImage);

              const windSpeed = document.createElement("div");
              windSpeed.innerText =
                "Wind speed: " + city.daily[i].wind_speed + " MPH";
              resultBody.append(windSpeed);

              const humidity = document.createElement("div");
              humidity.innerText = "Humidity: " + city.daily[i].humidity + " %";
              resultBody.append(humidity);

              const temperature = document.createElement("div");
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

const previousSearches = document.getElementsByClassName("searchedButtons");

//render previous searches to screen on loading
renderButtons();
searchButtonEl.addEventListener("click", getWeather);

//add event listeners to previous search buttons
for (let i = 0; i < previousSearches.length; i++) {
  previousSearches[i].addEventListener("click", getWeather);
}
