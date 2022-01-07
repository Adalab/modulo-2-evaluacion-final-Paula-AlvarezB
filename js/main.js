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

// BOTÓN DE BUSCAR
// función coger información del botón buscar

function handleUserSearch(event) {
  event.preventDefault();
  userSearch = userValue.value;
  fetch(`https://api.jikan.moe/v3/search/anime?q=${userSearch}`)
    .then((response) => response.json())
    .then((data) => {
      seriesSearch = data.results;
      paintSeries();
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

//función pintar series encontradas en la búsqueda
const paintSeries = () => {
  results.innerHTML = "";
  for (const eachSeries of seriesSearch) {
    if (eachSeries.image_url === null) {
      results.innerHTML += `<li class= "movieCard js_add_series" data-id="${eachSeries.mal_id}"<div class ="movieDiv"<h4>Nombre de la serie: "${eachSeries.title}" </h4> <img class="thumbnail js_add_series"  src=""https://via.placeholder.com/210x295/ffffff/666666/?text=TV""><div></li>`;
    } else {
      results.innerHTML += `<li class= "movieCard js_add_series" data-id="${eachSeries.mal_id}"><h4>Nombre de la serie: "${eachSeries.title}" </h4> <img data-id="${eachSeries.mal_id}"class="thumbnail"  src="${eachSeries.image_url}"/></li>`;
    }
  }
  //hacer clickables los li de cada serie
  const addToFavoritesSeriesList = document.querySelectorAll(".js_add_series");
  for (const addToSeriesClick of addToFavoritesSeriesList) {
    addToSeriesClick.addEventListener("click", handleAddToFavourites);
  }

  //al cargar la lista de resultados, revisar si está en favoritos y si lo está, añadirle la clase css favoritos
  const searchID = document.getElementsByClassName("js_add_series");
  const favID = document.getElementsByClassName("js_fav_series");

  for (const eachLi of searchID) {
    for (const eachFavLi of favID) {
      if (parseInt(eachLi.dataset.id) === parseInt(eachFavLi.dataset.id)) {
        eachLi.classList.add("favorite");
      }
    }
  }
};

//función activar el botón x para borrar
listenButtonFavorites();

//función borrar elementos de favoritos

function XremoveFavorites(ev) {
  const clickedId = parseInt(ev.currentTarget.dataset.id);

  const dataID = document.getElementsByClassName("js_add_series");

  for (const eachLi of dataID) {
    if (parseInt(eachLi.dataset.id) === clickedId) {
      eachLi.classList.toggle("favorite");
    }
  }

  let foundItem;
  //iterar para encontrar el item en el array favoriteSeries con ese id
  for (const serieInFavorites of favouriteSeries) {
    if (serieInFavorites.mal_id === clickedId) {
      foundItem = serieInFavorites;
    }
  }

  //eliminar la serie del array de favoritos
  let foundIndex;
  for (let index = 0; index < favouriteSeries.length; index += 1) {
    if (favouriteSeries[index].mal_id === clickedId) {
      foundIndex = index;
    }
  }

  favouriteSeries.splice(foundIndex, 1);

  // eachFavorite.parentNode.classList.toggle("favorite");
  setInLoCalStorage();
  //volver a pintar favoritos sin la serie eliminada
  paintFavourites();
}

function listenButtonFavorites() {
  //seleccionar todas la x para borrar elementos de favoritos
  let removeFavorites = document.querySelectorAll(".js_removeFavorites");

  for (const eachRemove of removeFavorites) {
    eachRemove.addEventListener("click", XremoveFavorites);
  }
}
function deleteAllFavorites() {
  favouriteSeries = [];
  paintFavourites();
  setInLoCalStorage();
  //eliminar clase css de lista de resutados al borrar todos los favoritos

  const deleteAllClasses = document.getElementsByClassName("js_add_series");
  for (const eachSerie of deleteAllClasses) {
    eachSerie.classList.remove("favorite");
  }
}

function listenButtonDeleteAllFavorites() {
  const deleteAllFavs = document.querySelector(".js_buttonDeleteAllFavorites");
  deleteAllFavs.addEventListener("click", deleteAllFavorites);
}

function handleReset(event) {
  event.preventDefault;
  userValue.value = "";
  results.innerHTML = "";
}
resetBtn.addEventListener("click", handleReset);

const handleAddToFavourites = (ev) => {
  const selectedSeries = ev.currentTarget;

  let clickedId = parseInt(selectedSeries.dataset.id);

  //comprobar si una serie ya está en favoritos para que no se repita usando el array favouriteSeries y la variable clickedID

  const selectedSeriesData = seriesSearch.find(
    (singleSerie) => singleSerie.mal_id === clickedId
  );
  const favoriteSeriesData = favouriteSeries.find(
    (singleFavSerie) => singleFavSerie.mal_id === clickedId
  );

  //añadir la serie al array de favoritos
  if (favoriteSeriesData === undefined) {
    let foundSerie;
    for (const singleSerie of seriesSearch) {
      if (singleSerie.mal_id === clickedId) {
        foundSerie = singleSerie;
        favouriteSeries.push({
          mal_id: foundSerie.mal_id,
          title: foundSerie.title,
          image_url: foundSerie.image_url,
        });
      }
    }
    //añadir la serie al array de favoritos

    //añadir clase css al elemento clickado
    selectedSeries.classList.add("favorite");

    //pintar en la parte izquierda las tarjetas de las películas que están en el array de favoritas
    paintFavourites();
    //si la película ya esté en el array de favoritos
  } else {
    XremoveFavorites(ev);
    selectedSeries.classList.remove("favorite");
    paintFavourites();
  }
  setInLoCalStorage();
};

function paintFavourites() {
  favResults.innerHTML = "";
  for (const eachFavorite of favouriteSeries) {
    favResults.innerHTML += `<li class= "favCard js_fav_series" data-id="${eachFavorite.mal_id}"><img class= "thumbnail" src="${eachFavorite.image_url}"><h4>Nombre de la serie: "${eachFavorite.title}"</h4> <i data-id="${eachFavorite.mal_id}" class="fas fa-times-circle js_removeFavorites"></i></li>`;
  }
  favResults.innerHTML += `<button class="deleteAll  js_buttonDeleteAllFavorites hidden">Borrar todos</button>`;

  const deleteButtonAll = document.getElementsByClassName("deleteAll");
  const parentDelete = deleteButtonAll.parentNode;

  //hacer que el botón borrar todo desaparezca cuando hay un elemento o menos
  if (favouriteSeries.length > 1) {
    for (const buttonD of deleteButtonAll) {
      buttonD.classList.remove("hidden");
    }
  }

  //añadir listeners para los dos tipos de botones que se generan

  //x para borrar de uno en uno:

  listenButtonFavorites();
  //botón para borrar todos
  listenButtonDeleteAllFavorites();
}

//guardar en local Storage
const setInLoCalStorage = () => {
  const stringifiedFavouriteSeries = JSON.stringify(favouriteSeries);
  localStorage.setItem("favourites", stringifiedFavouriteSeries);
};
