import axios from 'axios';
import {key, proxy} from '../config.js' //.. means one directory above since config.js is one folder above

export default class Search {
  constructor(query){
    this.query = query;
  }

  //Prototype
  async getResults(query){
    try {
      const res = await axios(`${proxy}www.food2fork.com/api/search?key=${key}&q=${this.query}`) // Search request url is provided on the website. We must concatanate the key and the query
      this.result = res.data.recipes; //We want to store the results inside the Search object. We create a new property 'result' and add it to the object
    } catch(error) {
      alert(error)
    }

  }
}
