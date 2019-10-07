import uniqid from 'uniqid'

export default class List {
  constructor(){
    this.items = []; //All elements added to the list will be pushed into this one property 'items'
    //The array items will contain objects that each contain a count, unit and ingredient
  }

  addItem(count, unit, ingredient){
    const item = {
      id: uniqid(), //A unique id will be generated for every item using the uniqid module
      count,
      unit,
      ingredient
    }
    this.items.push(item) //Saves the new item
    return item // Good practice to return the item created even if not necessary
  }

  deleteItem(id){
    const index = this.items.findIndex(el => el.id === id) //Find location of the item whose id is the one input by user
    ///[2,4,8] .splice[1,2] ---> return [4,8], original array is [2].
    ///[2,4,8] .slice[1,2] ---> return 4, original array is [2,4,8]
    this.items.splice(index, 1) // Deletes the item from datamodel. No need to return it.
  }

  updateCount(id, newCount) {
    this.items.find(el => el.id === id).count = newCount // .find selects the element with this id. We replace the count of this element with the new count
  }
}
