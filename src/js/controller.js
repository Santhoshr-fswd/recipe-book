import icons from 'url:../img/icons.svg';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import { async } from 'regenerator-runtime';
import resultsView from './views/resultsView.js';
import SearchView from './views/SearchView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

if (module.hot) {
  module.hot.accept();
}

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // loading Spinner

    recipeView.renderSpinner();

    //updating results to mark the selected one

    resultsView.update(model.getSearchResultsPage());

    // bookmarks view update to make it highlight cuuent ecippe in bookmark

    bookmarksView.update(model.state.bookmarks);

    // Loading Recipe

    await model.loadRecipe(id);

    // Redering recipe

    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    // // loading Spinner
    resultsView.renderSpinner();
    // // searching
    await model.searchRecipe(SearchView.getQuery());
    // // rendering results
    resultsView.render(model.getSearchResultsPage(1));
    // Pagination
    paginationView.render(model.state.search);
  } catch (err) {
    SearchView.renderError();
  }
};

const controlPagination = function (goToPage) {
  // // rendering page wise results
  resultsView.render(model.getSearchResultsPage(goToPage));
  // Pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings
  model.updateServings(newServings);

  // updating recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // adding bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  // removing bookmark
  else model.deleteBookmark(model.state.recipe.id);
  // updating recipe view
  recipeView.update(model.state.recipe);
  // rendering bookmarks
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerrender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  SearchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
