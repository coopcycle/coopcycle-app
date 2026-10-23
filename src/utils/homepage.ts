import { HomepageBlock } from '../redux/api/types';

/**
 * The subset of a restaurant the collections are resolved on. `facets` is
 * served by `GET /api/restaurants` only (serialization group
 * `restaurant_list`), hence optional.
 */
export type CollectableRestaurant = {
  '@id': string;
  facets?: {
    category?: string[];
    cuisine?: string[];
    type?: string;
  };
  edenredEnabled?: boolean;
  edenredMerchantId?: string | null;
};

/**
 * A `shop_collection` block resolved against the restaurants we already have
 * in the store, ready to be rendered as one horizontal row.
 */
export type ShopCollection<T extends CollectableRestaurant> = {
  // Stable key for the list, unique across the resolved collections.
  key: string;
  title: string;
  restaurants: T[];
};

type ShopCollectionEntity = {
  '@id': string;
  title: string;
  slug: string;
  shops: string[];
};

// Collections that cannot be resolved from the data the app already has.
// `newest` needs `createdAt`, which `GET /api/restaurants` does not expose.
const UNSUPPORTED_COMPONENTS = ['newest'];

// `facets.type` holds the full schema.org URL ("http://schema.org/Bakery"),
// while a block references the slugified enum key ("bakery", "bar-or-pub").
// Comparing both stripped down to lowercase letters bridges the two.
function normalizeType(type: string | undefined | null): string {
  if (!type) {
    return '';
  }

  const name = type.substring(type.lastIndexOf('/') + 1);

  return name.replace(/[^a-z]/gi, '').toLowerCase();
}

// Cuisine names and shop types are not translated in the app, so we at least
// turn "fast-food-restaurant" into "Fast food restaurant".
function humanize(value: string): string {
  const text = value.replace(/[-_]+/g, ' ').trim();

  return text.charAt(0).toUpperCase() + text.slice(1);
}

function categoryMatcher(category: string) {
  return (restaurant: CollectableRestaurant) =>
    (restaurant.facets?.category ?? []).includes(category);
}

function matcherFor(
  component: string,
  args: Record<string, string>,
): ((restaurant: CollectableRestaurant) => boolean) | null {
  switch (component) {
    case 'featured':
      return categoryMatcher('featured');
    case 'exclusive':
      return categoryMatcher('exclusive');
    case 'zerowaste':
      return categoryMatcher('zero_waste');
    case 'edenred':
      return restaurant =>
        Boolean(restaurant.edenredEnabled) &&
        Boolean(restaurant.edenredMerchantId);
    case 'cuisine':
      return restaurant =>
        (restaurant.facets?.cuisine ?? []).includes(args.cuisine);
    case 'type':
      return restaurant =>
        normalizeType(restaurant.facets?.type) === normalizeType(args.type);
    default:
      return null;
  }
}

function titleFor(
  component: string,
  args: Record<string, string>,
  t: (key: string) => string,
): string | null {
  switch (component) {
    case 'featured':
      return t('HOMEPAGE_FEATURED');
    case 'exclusive':
      return t('HOMEPAGE_EXCLUSIVE');
    case 'zerowaste':
      return t('HOMEPAGE_ZERO_WASTE');
    case 'edenred':
      return 'Edenred';
    case 'cuisine':
      return args.cuisine ? humanize(args.cuisine) : null;
    case 'type':
      return args.type ? humanize(args.type) : null;
    default:
      return null;
  }
}

/**
 * Turns the blocks of the custom homepage into collections of restaurants.
 *
 * Blocks only describe *which* collection to show, not its contents, so each
 * one is resolved against the restaurants that are already loaded — which also
 * keeps the collections consistent with the address the customer searched for.
 * Blocks the app cannot render (banners, sliders, delivery forms) and
 * collections that end up empty are dropped.
 */
export function resolveShopCollections<T extends CollectableRestaurant>(
  blocks: HomepageBlock[] | undefined,
  restaurants: T[],
  shopCollections: ShopCollectionEntity[] | undefined,
  t: (key: string) => string,
): ShopCollection<T>[] {
  if (!blocks || restaurants.length === 0) {
    return [];
  }

  const collections: ShopCollection<T>[] = [];
  const seen = new Set<string>();

  blocks.forEach((block, index) => {
    if (block.type !== 'shop_collection') {
      return;
    }

    const component = block.data?.component;
    if (!component || UNSUPPORTED_COMPONENTS.includes(component)) {
      return;
    }

    const args = block.data?.args ?? {};

    let title: string | null;
    let items: T[];

    if (component === 'custom') {
      const collection = (shopCollections ?? []).find(
        c => c.slug === args.slug,
      );
      if (!collection) {
        return;
      }
      const shops = new Set(collection.shops ?? []);
      title = collection.title;
      items = restaurants.filter(restaurant => shops.has(restaurant['@id']));
    } else {
      const matches = matcherFor(component, args);
      if (!matches) {
        return;
      }
      title = titleFor(component, args, t);
      items = restaurants.filter(matches);
    }

    if (!title || items.length === 0) {
      return;
    }

    // The same collection may legitimately appear twice in the blocks; render
    // it once, and keep the key unique for the list anyway.
    const key = `${component}:${JSON.stringify(args)}`;
    if (seen.has(key)) {
      return;
    }
    seen.add(key);

    collections.push({ key: `${key}:${index}`, title, restaurants: items });
  });

  return collections;
}
