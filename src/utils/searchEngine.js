import Fuse from 'fuse.js';

class SearchEngine {

  static #instance: Fuse;
  static #restaurants: Array = [];

  static getEngine(): Fuse
  {
    if (this.#instance === null) {
      throw new Error('SearchEngine is not initialized')
    }
    return this.#instance;
  }

  static setRestaurants(restaurants) {

    this.#restaurants = restaurants;

    const options = {
      includeScore: true,
      useExtendedSearch: true,
      keys: [
        'name',
        {
          name: [['facets'], ['cuisine']],
          weight: 2,
        },
        {
          name: [['facets'], ['category']],
          weight: 0.5,
        },
      ],
    }
    const index = Fuse.createIndex(options.keys, restaurants)
    this.#instance = new Fuse(this.#restaurants, options, index)
    console.info(`Search engine initialized with: ${this.getEngine().getIndex().size()} restaurants`)
  }

  static search(query) {
    return this.getEngine().search(query)
  }
}

export default SearchEngine
