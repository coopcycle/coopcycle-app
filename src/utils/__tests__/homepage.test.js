import { resolveShopCollections } from '../homepage';

const t = key => key;

const bakery = {
  '@id': '/api/restaurants/1',
  facets: {
    category: ['featured'],
    cuisine: [],
    type: 'http://schema.org/Bakery',
  },
};

const italian = {
  '@id': '/api/restaurants/2',
  facets: {
    category: ['exclusive', 'zero_waste'],
    cuisine: ['italian'],
    type: 'http://schema.org/Restaurant',
  },
  edenredEnabled: true,
  edenredMerchantId: '1234',
};

const restaurants = [bakery, italian];

const block = (component, args) => ({
  type: 'shop_collection',
  data: args ? { component, args } : { component },
});

describe('resolveShopCollections', () => {
  it('returns nothing without blocks or restaurants', () => {
    expect(resolveShopCollections(undefined, restaurants, [], t)).toEqual([]);
    expect(resolveShopCollections([block('featured')], [], [], t)).toEqual([]);
  });

  it('ignores blocks the app cannot render', () => {
    const blocks = [
      { type: 'banner', data: { markdown: '### Hello' } },
      { type: 'slider', data: { slides: [] } },
      { type: 'delivery_form', data: { form: '/api/delivery_forms/1' } },
      block('newest'),
    ];

    expect(resolveShopCollections(blocks, restaurants, [], t)).toEqual([]);
  });

  it('resolves category collections', () => {
    const collections = resolveShopCollections(
      [block('featured'), block('exclusive'), block('zerowaste')],
      restaurants,
      [],
      t,
    );

    expect(collections.map(c => c.title)).toEqual([
      'HOMEPAGE_FEATURED',
      'HOMEPAGE_EXCLUSIVE',
      'HOMEPAGE_ZERO_WASTE',
    ]);
    expect(collections[0].restaurants).toEqual([bakery]);
    expect(collections[1].restaurants).toEqual([italian]);
    expect(collections[2].restaurants).toEqual([italian]);
  });

  it('resolves cuisine collections', () => {
    const collections = resolveShopCollections(
      [block('cuisine', { cuisine: 'italian' })],
      restaurants,
      [],
      t,
    );

    expect(collections).toHaveLength(1);
    expect(collections[0].title).toEqual('Italian');
    expect(collections[0].restaurants).toEqual([italian]);
  });

  it('matches a shop type slug against the schema.org URL', () => {
    const collections = resolveShopCollections(
      [block('type', { type: 'bakery' })],
      restaurants,
      [],
      t,
    );

    expect(collections[0].restaurants).toEqual([bakery]);
  });

  it('resolves edenred on the merchant id', () => {
    const collections = resolveShopCollections(
      [block('edenred')],
      restaurants,
      [],
      t,
    );

    expect(collections[0].restaurants).toEqual([italian]);
  });

  it('resolves custom collections against their shop IRIs', () => {
    const collections = resolveShopCollections(
      [block('custom', { slug: 'our-picks' })],
      restaurants,
      [
        {
          '@id': '/api/shop_collections/1',
          title: 'Our picks',
          slug: 'our-picks',
          shops: ['/api/restaurants/2'],
        },
      ],
      t,
    );

    expect(collections).toHaveLength(1);
    expect(collections[0].title).toEqual('Our picks');
    expect(collections[0].restaurants).toEqual([italian]);
  });

  it('drops a custom collection the server does not know about', () => {
    expect(
      resolveShopCollections(
        [block('custom', { slug: 'gone' })],
        restaurants,
        [],
        t,
      ),
    ).toEqual([]);
  });

  it('drops collections that end up empty', () => {
    expect(
      resolveShopCollections(
        [block('cuisine', { cuisine: 'japanese' })],
        restaurants,
        [],
        t,
      ),
    ).toEqual([]);
  });

  it('renders a repeated collection only once', () => {
    const collections = resolveShopCollections(
      [block('featured'), block('featured')],
      restaurants,
      [],
      t,
    );

    expect(collections).toHaveLength(1);
  });

  it('keeps the order of the blocks', () => {
    const collections = resolveShopCollections(
      [block('exclusive'), block('featured')],
      restaurants,
      [],
      t,
    );

    expect(collections.map(c => c.title)).toEqual([
      'HOMEPAGE_EXCLUSIVE',
      'HOMEPAGE_FEATURED',
    ]);
  });
});
