import Fuse from 'fuse.js';

class SearchEngine {

  static _instance: Fuse;
  static _restaurants: Array = [];

  static getEngine(): Fuse
  {
    if (this._instance === null) {
      throw new Error('SearchEngine is not initialized')
    }
    return this._instance;
  }

  static setRestaurants(restaurants) {
    const options = {
      includeScore: true,
      useExtendedSearch: true,
      keys: [
        'name',
        {
          name: [['facets'], ['cuisine']],
          weight: 2,
        },
      ],
    }
    const index = Fuse.createIndex(options.keys, restaurants)
    this._restaurants = restaurants;
    this._instance = new Fuse(restaurants, options, index)
    console.info(`Search engine initialized with: ${this.getEngine().getIndex().size()} restaurants`)
  }

  static search(query) {
    return this.getEngine().search(query)
  }
}

export default SearchEngine
