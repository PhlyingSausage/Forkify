import { elements } from './base';

// Render new item
export const renderItem = item => {
  const markup =  `
      <li class="shopping__item" data-itemid=${item.id}>
          <div class="shopping__count">
              <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value">
              <p>${item.unit}</p>
          </div>
          <p class="shopping__description">${item.ingredient}</p>
          <button class="shopping__delete btn-tiny">
              <svg>
                  <use href="img/icons.svg#icon-circle-with-cross"></use>
              </svg>
          </button>
      </li>
  `;
      elements.shopping.insertAdjacentHTML('beforeend', markup) //'beforeend' means that every new item added will be added just before the end (bottom) of the list, essentially the last one.
// just like "data-goto", "data-itemid" allows you to select an item based on this attribute, in this case the id.
}

// Remove item
export const deleteItem = id => {
  const item = document.querySelector(`[data-itemid="${id}"]`); //Allows us to select element by their ID, which was saved in the css when they are created
  if (item) item.parentElement.removeChild(item); // We must move to parent in order to remove child
}
