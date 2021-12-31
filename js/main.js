"use strict";

//VARIABLES GLOBALES HTML
let userSearch = document.querySelector(".js_searchButton");
let resetBtn = document.querySelector(".js_resetButton");
let userValue = document.querySelector(".js_input");
const results = document.querySelector(".js_results");
const favResults = document.querySelector(".js_favShows");

//ARRAYS
//series encontradas
let seriesSearch = [];
//series marcadas como favoritas
let favouriteSeries = [];

//BOTÓN DE BUSCAR
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

//LOCAL STORAGE
//leer del local storage
const getFromLocalStorage = () => {
  const localStorageFavs = localStorage.getItem("favourites");
  if (localStorageFavs !== null) {
    favouriteSeries = JSON.parse(localStorageFavs);
    paintFavourites();
  }
};

//revisar el local storage a ver si tiene algo
getFromLocalStorage();

//pintar las series favoritas que haya guardadas
paintFavourites();

// // //función pintar series encontradas en la búsqueda
const paintSeries = () => {
  for (const eachSeries of seriesSearch) {
    if (eachSeries.image_url === "null") {
      eachSeries.image_url ===
        "https://via.placeholder.com/210x295/ffffff/666666/?text=TV";
    }
    results.innerHTML += `<li class= "movieCard js_add_series" data-id="${eachSeries.mal_id}"<div class ="movieDiv"<h4>Nombre de la serie: "${eachSeries.title}" </h4> <img class="thumbnail js_add_series"  src="${eachSeries.image_url}"><div></li>`;
  }
};

//función activar el botón x para borrar
listenButtonFavorites();
//función borrar elementos de favoritos directamente
function XremoveFavorites(ev) {
  const clickedId = parseInt(ev.target.dataset.id);
  console.log(clickedId);
  let foundItem;
  //iterar para encontrar el item en el array favoriteSeries con ese id
  for (const serieInFavorites of favouriteSeries) {
    if (serieInFavorites.mal_id === clickedId) {
      foundItem = serieInFavorites;
    }
  }
  let foundIndex;
  for (let index = 0; index < favouriteSeries.length; index += 1) {
    if (favouriteSeries[index].mal_id === clickedId) {
      foundIndex = index;
    }
  }
  console.log(foundIndex);
  favouriteSeries.splice(foundIndex, 1);
  paintFavourites();
}
// }

function listenButtonFavorites() {
  //seleccionar todas la x para borrar elementos de favoritos
  let removeFavorites = document.querySelectorAll(".js_removeFavorites");

  for (const eachRemove of removeFavorites) {
    eachRemove.addEventListener("click", XremoveFavorites);
  }
}

function handleReset(event) {
  event.preventDefault;
  userValue.value = "";
  results.innerHTML = "";
}
resetBtn.addEventListener("click", handleReset);

const handleAddToFavourites = (ev) => {
  //usar parentNode para darle toda la acción a li?
  const selectedSeries = ev.target;
  const selectedSeriesParent = selectedSeries.parentNode;
  console.log(selectedSeries);
  console.log(ev.target.dataset.id);
  let clickedId = parseInt(ev.target.dataset.id);

  //comprobar si una serie ya está en favoritos para que no se repita usando el array favouriteSeries y la variable clickedID
  let foundSerie2;
  for (const eachFavorite of favouriteSeries) {
    if (eachFavorite.mal_id === clickedId) {
      foundSerie2 = eachFavorite;
    }
  }
  //si la serie todavía no está en favoritos, se añade revisando el id de la serie para asociarla a su nombre y añadir esa en concreto al array de favoritos
  if (foundSerie2 === undefined) {
    //busco el producto clickado en el array del resultado de búsqueda

    let foundSerie;
    for (const singleSerie of seriesSearch) {
      if (singleSerie.mal_id === clickedId) {
        foundSerie = singleSerie;
      }
    }
    //añadir la serie al array de favoritos
    favouriteSeries.push({
      mal_id: foundSerie.mal_id,
      title: foundSerie.title,
      image_url: foundSerie.image_url,
    });

    //añadir clase css al elemento clickado
    selectedSeries.classList.add("favorite");

    //pintar en la parte izquierda las tarjetas de las películas que están en el array de favoritas
    paintFavourites();
    //si la película ya esté en el array de favoritos
  } else {
    // let foundSerie;
    // for (const singleSerie of seriesSearch) {
    //   if (singleSerie.mal_id === clickedId) {
    //     foundSerie = singleSerie;
    //   }
    // }
    // //sacar la película del array de favoritos
    // favouriteSeries.pop({
    //   mal_id: foundSerie.mal_id,
    //   title: foundSerie.title,
    //   image_url: foundSerie.image_url,
    // });
    XremoveFavorites(ev);
    selectedSeries.classList.remove("favorite");
    paintFavourites();
  }
  paintFavourites();
  console.log(favouriteSeries);
  setInLoCalStorage();
};

function paintFavourites() {
  favResults.innerHTML = "";
  for (const eachFavorite of favouriteSeries) {
    favResults.innerHTML += `<li class= favCard js_add_series" data-id="${eachFavorite.mal_id}"><img class= "thumbnail" src="${eachFavorite.image_url}"><h4>Nombre de la serie: "${eachFavorite.title}"</h4> <i data-id="${eachFavorite.mal_id}" class="fas fa-times-circle js_removeFavorites"></i></li>`;
  }
  listenButtonFavorites();
}

//guardar en local Storage
const setInLoCalStorage = () => {
  const stringifiedFavouriteSeries = JSON.stringify(favouriteSeries);
  localStorage.setItem("favourites", stringifiedFavouriteSeries);
};
