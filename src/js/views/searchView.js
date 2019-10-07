import {elements} from './base'
export const getInput = () => elements.searchInput.value; //This function will return the value of the search input

export const clearInput = () => elements.searchInput.value = ""; //This will clear the input box

export const clearResults = () => {
  elements.searchResList.innerHTML = ""; //The .innerHTMl allows us to clear previously inserted HTMl, in this case the results
  elements.searchResPages.innerHTML = ""; //clearing the buttons
};

export const highlightSelected = id => {

  //1. We remove the highlight from all previous searches
  const resultsArr = Array.from(document.querySelectorAll('.results__link')) //Array.from generates an array from an input document query selector. In this case, an array of all elements containing the class "results__link"
  resultsArr.forEach(el => {
    el.classList.remove('results__link--active') //Loop through the array of "results__link" class elements and remove the "results__link--active" class (ie, remove the highlight)
  })
  //2. We apply higlight to the new search
  document.querySelector(`a[href*="${id}"]`).classList.add('results__link--active')
  //a[href*=#] gets all anchors (a) that contain id in href and adds a class to it
}

/* Example: pasta with tomato and spinach
acc: 0 / acc + cur.length = 5 (<17) ==> NewTitle = ['pasta']
acc: 5 / acc + cur.length = 9 (<17) ==> NewTitle = ['pasta', 'with']
acc: 9 / acc + cur.length = 16 (<17) ==> NewTitle = ['pasta', 'with', 'tomato']
acc: 18 / acc + cur.length = 18 (>17) ==> Break
*/
const limitRecipeTitle = (title, limit = 17) =>{
  const newTitle = [];
  if (title.length > limit){
    title.split(' ').reduce((acc, cur) => { //reduce() method is just like forEach, but with a built-in counter (ie, acc)
      if (acc + cur.length <= limit){
        newTitle.push(cur)
      }
      return acc + cur.length
    }, 0);

    return `${newTitle.join(' ')}...`
  }
  return title
}

const renderRecipe = recipe =>{ //Private function. Individual view
  const markup =`
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
  `;

  elements.searchResList.insertAdjacentHTML('beforeend', markup);
}

// type: 'prev' or 'next'
const createButton = (page, type) =>`
                  <button class="btn-inline results__btn--${type}" data-goto = ${type === 'prev' ? page -1 : page +1}>
                    <span>Page ${type === 'prev' ? page -1 : page +1}</span>
                      <svg class="search__icon">
                          <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
                      </svg>
                  </button>
                  `

const renderButtons = (page, numResults, resPerPage) =>{
  const pages = Math.ceil(numResults / resPerPage) //Ex: 30 results => 30 results / 10 per page = 3 pages; Ex2: 30 results => 45 / 10 per page = 4.5 pages => 5 pages

  let button; // because value of "button" will change depeneding on scenario, we must declare it as variable (ie, let), not const
  if (page === 1 && pages > 1){ // && pages > 1 necessary in order to display the next button when there are enough results for another page. If there aren't enough results for more pages, then not button should appear.
    //Button to go to 'next page' only
    button = createButton(page, 'next')
  }else if (page < pages){
    //Both 'next page' and 'previous page' buttons
    button = `
      ${createButton(page, 'prev')}
      ${createButton(page, 'next')}
    `;
  }else if (page === pages && pages >1){ //last page
    //Button to go the the 'previous page' only
    button = createButton(page, 'prev')
  }
  elements.searchResPages.insertAdjacentHTML('afterbegin', button)
}

export const renderResults = (recipes, page = 1, resPerPage = 10) => { //List view
  // Render results of current page
  // Example:
  // Page 1: 1 to 9 [0,10]
  // Page 2: 10 to 19 [11,20]
  // Page 3: 20 to 29 [21,29]
  //, etc.
  const start = (page -1) * resPerPage;
  const end = page * resPerPage;

  recipes.slice(start, end).forEach(renderRecipe) // Display how many times the detail view is repeated in the list view

  //render pagination buttons
  renderButtons(page, recipes.length, resPerPage)
}
