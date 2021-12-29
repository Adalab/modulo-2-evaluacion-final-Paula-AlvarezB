/*
"use strict";

//variables globales
let userSearch = document.querySelector(".js_searchButton");
let resetBtn = document.querySelector(".js_resetButton");
let userValue = document.querySelector(".js_input");

const results = document.querySelector(".js_results");
const favResults = document.querySelector(".js_favShows");

//series encontradas
let seriesSearch = [];
//series elegidas como favoritas
let favouriteSeries = [];

//función coger información del botón buscar
function handleUserSearch() {
  userSearch = userValue.value;

  fetch(`https://api.jikan.moe/v3/search/anime?q=${userSearch}`)
    .then((response) => response.json())
    .then((data) => {
      seriesSearch = data.results;
      paintSeries();
    });
}

userSearch.addEventListener("click", handleUserSearch);

// // //función pintar series encontradas en la búsqueda
const paintSeries = () => {
  for (const eachSeries of seriesSearch) {
    if (eachSeries.image_url === "null") {
      eachSeries.image_url ===
        "https://via.placeholder.com/210x295/ffffff/666666/?text=TV";
    }
    results.innerHTML += `<div class= "movieCard js_add_series" data-id="${eachSeries.mal_id}"<h4>Nombre de la serie: "${eachSeries.title}"</h4> <img class= "js_add_series"  src="${eachSeries.image_url}"></div>`;
  }
  //hacer clickables los divs de cada serie
  const addToFavoritesSeriesList = document.querySelectorAll(".js_add_series");
  for (const addToSeriesClick of addToFavoritesSeriesList) {
    addToSeriesClick.addEventListener("click", handleAddToFavourites);
  }
};
function handleReset() {
  userValue.value = "";
  results.innerHTML = "";
}
resetBtn.addEventListener("click", handleReset);

const handleAddToFavourites = (ev) => {
  //comprobar si una serie ya está en favoritos para que no se repita usando el array favouriteSeries y la variable clickedID

  console.log

  let clickedId = parseInt(ev.target.dataset.id);
  let foundSerie;
  for (const singleSerie of seriesSearch) {
    if (singleSerie.mal_id === clickedId) {
      foundSerie = singleSerie;
    }
  }

  favouriteSeries.push({
    mal_id: foundSerie.mal_id,
    title: foundSerie.title,
    image_url: foundSerie.image_url,
  });
  const selectedSeries = ev.target;
  selectedSeries.classList.toggle("favorite");
  paintFavourites();
};
console.log(favouriteSeries);

function paintFavourites() {
  for (const eachFavorite of favouriteSeries) {
    favResults.innerHTML += `<div class= "movieCard js_add_series" data-id="${eachFavorite.mal_id}"<h4>Nombre de la serie: "${eachFavorite.title}"</h4> <img src="${eachFavorite.image_url}"></div>`;
  }
}
 */
