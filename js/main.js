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
function handleUserSearch(event) {
  event.preventDefault();
  userSearch = userValue.value;

  fetch(`https://api.jikan.moe/v3/search/anime?q=${userSearch}`)
    .then((response) => response.json())
    .then((data) => {
      seriesSearch = data.results;
      paintSeries();
      //hacer clickables los divs de cada serie
      const addToFavoritesSeriesList =
        document.querySelectorAll(".js_add_series");
      for (const addToSeriesClick of addToFavoritesSeriesList) {
        addToSeriesClick.addEventListener("click", handleAddToFavourites);
      }
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
    results.innerHTML += `<li class= "movieCard js_add_series" data-id="${eachSeries.mal_id}"><h4>Nombre de la serie: "${eachSeries.title}"</h4> <img class="thumbnail js_add_series" src="${eachSeries.image_url}"></li>`;
  }
};
function handleReset(event) {
  event.preventDefault;
  userValue.value = "";
  results.innerHTML = "";
}
resetBtn.addEventListener("click", handleReset);

const handleAddToFavourites = (ev) => {
  const favSection = document.querySelector(".js_favSection");
  favSection.classList.remove("hidden");
  const selectedSeries = ev.target;
  let clickedId = parseInt(ev.target.dataset.id);

  //comprobar si una serie ya está en favoritos para que no se repita usando el array favouriteSeries y la variable clickedID

  let foundSerie2;
  for (const eachFavorite of favouriteSeries) {
    if (eachFavorite.mal_id === clickedId) {
      foundSerie2 = eachFavorite;
    }
  }

  console.log(foundSerie2);
  if (foundSerie2 === undefined) {
    //busco el producto clickado
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
    selectedSeries.classList.add("favorite");

    //pintar en la parte izquierda las tarjetas de las películaque están en el array de favoritas
    paintFavourites();
  } else {
    let foundSerie;
    for (const singleSerie of seriesSearch) {
      if (singleSerie.mal_id === clickedId) {
        foundSerie = singleSerie;
      }
    }

    favouriteSeries.pop({
      mal_id: foundSerie.mal_id,
      title: foundSerie.title,
      image_url: foundSerie.image_url,
    });
    selectedSeries.classList.remove("favorite");
    paintFavourites();
  }
};

function paintFavourites() {
  favResults.innerHTML = "";
  for (const eachFavorite of favouriteSeries) {
    favResults.innerHTML += `<li class= favCard js_add_series" data-id="${eachFavorite.mal_id}"<h4>Nombre de la serie: "${eachFavorite.title}"</h4> <img class= "thumbnail" src="${eachFavorite.image_url}"></li>`;
  }
}
