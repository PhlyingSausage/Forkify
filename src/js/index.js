import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView'; //Since we are importing all, we must use the 'searchView' object to access any function or value from that module
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import { elements, renderLoader, clearLoader } from './views/base';

//State means all the data (search, likes, favorites, etc.) on the page at a given moment. We must
// create an object to manage the state.

//** Global state of the app
// - Search object
// - Current recipe object
// - Shopping list object
// - Liked recipes

const state = {}; // Each time we reload the page, the state is empty
///////// *** SEARCH CONTROLLER ***/////////////

//Upon clicking search button
const controlSearch = async () =>{
  //1. Get query from view
  const query = searchView.getInput() //TODO in the View module because it is GUI

  // //******FOR TESTING ONLY
  // const query = 'pizza'

  if (query){
    // 2. New search object and add to state
    state.search = new Search(query); //.search is adding a new property 'search' to the object 'state' using the dot notation. (ex: obj.key3 = "value3";)


      // 3.Prepare UI for results (spinner, clearing results)
      searchView.clearInput();
      searchView.clearResults();
      renderLoader(elements.resultContainer)

    try {
      // 4.Search for recipes
      await state.search.getResults() //Run the prototype getResults() on the new object, which will return 'result'. Result will be stored in 'result' property, as defined in the function Search.js

      //5. Render results in UI
      console.log(state.search.result)
      clearLoader()
      searchView.renderResults(state.search.result)

    } catch (err){
      console.log(err)
      alert('Error processing search!')
      clearLoader()
    }
  }
}

//Event Listener for the Search button
elements.searchForm.addEventListener('submit', e =>{
  e.preventDefault();
  controlSearch()
})

// //******FOR TESTING ONLY
// window.addEventListener('load', e =>{
//   e.preventDefault();
//   controlSearch()
// })

//Event Listener for pagination buttons
elements.searchResPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline') //The closest method allows us to return the closest ancestor with the class ".btn-inline", instead of returning the exact value of the clicked element
  if (btn){
    const goToPage = parseInt(btn.dataset.goto, 10) //dataset.goto allows us to grab the value that was stored during the createButton() function
    //We must also convert the output value to a number since it is a string so we use the parseInt() method. 10 means we are on base 10.
    searchView.clearResults(); // We must clear the current results and current buttons before displaying the new results
    searchView.renderResults(state.search.result, goToPage)
    console.log(goToPage)
  }
})


///////// *** RECIPE CONTROLLER ***/////////////

const controlRecipe = async () =>{
  //Get ID from the URL
  const id = window.location.hash.replace('#', '') // "window.location" is the URL. So .hash will grab the hash ID from the URL. The method .replace allows us to remove the "#"
  console.log(id)

  if (id){
    // 1. Prepare UI for changes
      recipeView.clearRecipe(); // Clear the content of previous recipe
      renderLoader(elements.recipe); //Loader spinner

      if (state.search) searchView.highlightSelected(id) // Highlight selected search item

    // 2. Create a new recipe object
      state.recipe = new Recipe(id); // We create a new recipe object using the model Recipe and store it in the state, which is the central place where we store our data

      // //******FOR TESTING ONLY
      // window.r = state.recipe

      try{
        // 3. Get recipe data and parse ingredients
          await state.recipe.getRecipe(); // Code will stop executing and wait for the promise to be executed
          state.recipe.parseIngredients();

        // 4. Calculate servings and time
          state.recipe.calcTime();
          state.recipe.calcServings();

        // 5. Render the recipe
          // console.log(state.recipe)
          clearLoader();
          recipeView.renderRecipe(state.recipe);

      } catch (err){
        console.log(err)
        alert('Error processing recipe!')
      }
  }
}

// To remove redundancy, we will group the 2 event listeners above into one that generates the same outcome.
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


///////// *** SHOPPING LIST CONTROLLER ***/////////////

const controlList = () => {
  // Create a new list if there is none yet
  if (!state.list) state.list = new List(); //Adding the list parameter to state

  // Add each ingredient to the list and UI
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item)
  })
}

// Handling shopping list button clicks
elements.shopping.addEventListener('click', e => {
   const id = e.target.closest('.shopping__item').dataset.itemid; //.closest will go to the closest Shopping item when you click, and will determine its id

   //Handle the delete event
   if (e.target.matches('.shopping__delete', '.shopping__delete *')) {
     //Delete from State
     state.list.deleteItem(id);

     //Delete from UI
     listView.deleteItem(id);
   }
})


// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {   //.btn-decrease * means any child of the btn-decrease class (like the svg icon)
    // Decrease button is clicked
      if (state.recipe.servings >1 ){ //We set this condition so that we can't decrease the serving to less than 1.
          state.recipe.updateServings('dec')
          recipeView.updateServingsIngredients(state.recipe)
      }
  } else if (e.target.matches('.btn-increase, .btn-decrease *')) {
    // Increase button is clicked
      state.recipe.updateServings('inc')
      recipeView.updateServingsIngredients(state.recipe)
    // Add to shopping cart is clicked
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) { //If the element e clicked matches the class .recipe__btn--add or any of the child element * (because the click could happen on the svg, span element, rather than just the btn)
      controlList();
  }

})
