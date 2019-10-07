import axios from 'axios'
import {key, proxy} from '../config.js'

export default class Recipe {
  constructor(id){
    this.id = id; //When we create a new recipe object, we will pass in this id, which can later be re-used to AJAX call more information later.
  }

  async getRecipe(){
    try {
      const res = await axios(`${proxy}www.food2fork.com/api/get?key=${key}&rId=${this.id}`)
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch (error){
      console.log(error);
      alert('Something went wrong!')
    }
  }

  calcTime(){
    //We assumme that we need 15 minute for every 3 ingredients
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng/3);
    this.time = periods * 15
  }

  calcServings(){
    this.servings = 4; // By default
  }

  //Standardize the ingredients (tbsp, tablespoon, etc.) by generating a new updated array based off the old one.
  parseIngredients(){
    // Find and replace to standardize units
    const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
    const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'lbs']
    const units = [...unitsShort, 'kg', 'g'] // We use destructuring ... to add more units to the existing array. With destructuring, instead of adding a new array to an existing array [[]], we join two arrays into one.

    const newIngredients = this.ingredients.map(el => { //.map is to loop over each ingredient
      // 1) Uniform units
      let ingredient  = el.toLowerCase()
      unitsLong.forEach((unit, i) => { // .forEach will loop over each word. unit = 'tablespoons, table...', i = index
        ingredient = ingredient.replace(unit, unitsShort[i]) //.replace will look for 'unit' (from unitsLong) in each ingredient and replace it by its short unit, which has the same index in both arrays.
      })

      // 2) Remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, " "); //We use regular expressions to define a recurring characters combination (in this case, (abcdef))

      // 3) Parse ingreditents into count, unit and ingredient

      const arrIng = ingredient.split(' ') //convert ingredients to an array
      const unitIndex = arrIng.findIndex(el2 => units.includes(el2)) //We use el2 since el is already used. Check if el2 is included in the unitsShort array. If it does (true), returns the index. If it doesn't, return -1.
      //.findIndex: loops throuhg array and returns the index of the element when the test/function turns out to be 'true'
      //.includes: returns true or false as to whether the element el2 is in the array

      let objIng;
      if (unitIndex > -1){
        // There is a unit
        // Ex. 4 1/2 cups, arrCount = {4, 1/2}
        // Ex 4 cups, arrCount = [4]
        const arrCount = arrIng.slice(0, unitIndex); // From index 0 until the index of the unit, we assume that they are numbers. Since there can be many numbers (ie, 4 1/2), we create an array to store them.

        let count;
        if (arrCount.length === 1){ // Ex 4 cups, arrCount = [4]
          count = eval(arrIng[0].replace('-','+')) // The ".replace('-','+')" portion is added for some edge cases where recipe uses the notation 4-1/2 to mean 4 1/2. When using eval, it will interpret - as a minus and output 3.5. - should be interpreted as an addition, so 4.5. That is why we must replace '-' with '+'
        } else {
          count = eval(arrIng.slice(0, unitIndex).join('+')) // Ex. 4 1/2 cups, arrCount = {4, 1/2}. Eval method will calculate 4 + 1/2 and return 4.5
        }

        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex +1).join(' ')
        };

      } else if (parseInt(arrIng[0], 10)){ // convert first element of array to integer. If it's a number, will output 1st element's value; if not a number, will return NaN.
        //There is no unit, but the 1st element is number
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: '',
          ingredient: arrIng.slice(1).join(' ')
        }
      } else if (unitIndex === -1){
        //There is no unit and no number in the 1st position
          objIng = {
            count: 1,
            unit: '',
            ingredient
          }
      }
      return objIng //.map method, we must return at the end of the loop and the result will be saved in the array
    })
    this.ingredients = newIngredients
  }

  updateServings (type){
    // Servings
    const newServings = type === 'dec' ? this.servings -1 : this.servings + 1; // For the number of servings at the top of the recipe header (by default, 4)

    // Ingredients
    this.ingredients.forEach(ing => {
      ing.count *= newServings/this.servings // *= means count *. We are updating the ratios
    })

    this.servings = newServings
  }
}
