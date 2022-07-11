import ProductOptionsBuilder from '../ProductOptionsBuilder'

const productOptions = [
  {
    '@type':'MenuSection',
    'name':'Accompagnement',
    'identifier':'62b16b74-22a9-39d3-898a-eca602602169',
    'additionalType':'free',
    'additional':false,
    'hasMenuItem':[
      { '@type':'MenuItem','name':'Frites','identifier':'b3b58c52-5159-3173-96c2-24b5608acf37','offers':{ '@type':'Offer','price':0 } },
      { '@type':'MenuItem','name':'Petits pois','identifier':'e2855e88-64c4-343f-b70d-5579402cf14e','offers':{ '@type':'Offer','price':0 } },
      { '@type':'MenuItem','name':'Purée','identifier':'29bbf16b-d432-3900-8301-9f6b696b8d51','offers':{ '@type':'Offer','price':0 } },
      { '@type':'MenuItem','name':'Salade','identifier':'49f77d10-336e-38e9-a620-ad30618de271','offers':{ '@type':'Offer','price':0 } },
      { '@type':'MenuItem','name':'Salade','identifier':'e588ec20-9b0e-3ec6-8164-bdfafdf4b440','offers':{ '@type':'Offer','price':0 } },
    ],
  }, {
    '@type':'MenuSection',
    'name':'Ingrédients',
    'identifier':'3da98061-b57a-48c1-9c7b-1a26b1cd8962',
    'additionalType':'free',
    'additional':true,
    'valuesRange':'[1,4]',
    'hasMenuItem':[
      { '@type':'MenuItem','name':'Bar','identifier':'4363401d-e69e-4c75-9fed-f75e44540b5d','offers':{ '@type':'Offer','price':0 } },
      { '@type':'MenuItem','name':'Bat','identifier':'64b97ccc-0ff5-4577-a881-8a0a834fdf80','offers':{ '@type':'Offer','price':0 } },
      { '@type':'MenuItem','name':'Baz','identifier':'2b1f2e13-c957-4786-8c48-d0a2b94806fd','offers':{ '@type':'Offer','price':0 } },
      { '@type':'MenuItem','name':'Foo','identifier':'8c68f1e4-3cac-48db-b030-9dce70d052e5','offers':{ '@type':'Offer','price':0 } },
    ],
  }, {
    '@type':'MenuSection',
    'name':'Suppléments',
    'identifier':'3da98061-b57a-48c1-9c7b-1a26b1cd8963',
    'additionalType':'free',
    'additional':true,
    'valuesRange':'[0,4]',
    'hasMenuItem':[
      { '@type':'MenuItem','name':'Bar','identifier':'4363401d-e69e-4c75-9fed-f75e44540b5e','offers':{ '@type':'Offer','price':0 } },
      { '@type':'MenuItem','name':'Bat','identifier':'64b97ccc-0ff5-4577-a881-8a0a834fdf81','offers':{ '@type':'Offer','price':0 } },
      { '@type':'MenuItem','name':'Baz','identifier':'2b1f2e13-c957-4786-8c48-d0a2b94806fe','offers':{ '@type':'Offer','price':0 } },
      { '@type':'MenuItem','name':'Foo','identifier':'8c68f1e4-3cac-48db-b030-9dce70d052e4','offers':{ '@type':'Offer','price':0 } },
    ],
  },
]

const notMandatoryProductOptions = [
  {
    '@type':'MenuSection',
    'name':'Sauces',
    'identifier':'SAUCES',
    'additionalType':'free',
    'additional':true,
    'valuesRange':'[0,4]',
    'hasMenuItem':[
      { '@type':'MenuItem','name':'Mayo','identifier':'MAYO','offers':{ '@type':'Offer','price':0 } },
      { '@type':'MenuItem','name':'Ketchup','identifier':'64b97ccc-0ff5-4577-a881-8a0a834fdf81','offers':{ '@type':'Offer','price':0 } },
      { '@type':'MenuItem','name':'Mustard','identifier':'2b1f2e13-c957-4786-8c48-d0a2b94806fe','offers':{ '@type':'Offer','price':0 } },
      { '@type':'MenuItem','name':'Foo','identifier':'8c68f1e4-3cac-48db-b030-9dce70d052e4','offers':{ '@type':'Offer','price':0 } },
    ],
  },
]

describe('ProductOptionsBuilder', () => {

  it('adds options', () => {

    const optionsBuilder = new ProductOptionsBuilder(productOptions)

    optionsBuilder.add({ 'identifier':'4363401d-e69e-4c75-9fed-f75e44540b5d' })
    expect(optionsBuilder.getPayload()).toEqual([
      {
        code: '4363401d-e69e-4c75-9fed-f75e44540b5d',
        quantity: 1,
        price: 0,
      },
    ])

    optionsBuilder.add({ 'identifier':'64b97ccc-0ff5-4577-a881-8a0a834fdf80' })
    expect(optionsBuilder.getPayload()).toEqual([
      {
        code: '4363401d-e69e-4c75-9fed-f75e44540b5d',
        quantity: 1,
        price: 0,
      }, {
        code: '64b97ccc-0ff5-4577-a881-8a0a834fdf80',
        quantity: 1,
        price: 0,
      },
    ])
  })

  it('increments options', () => {

    const optionsBuilder = new ProductOptionsBuilder(productOptions)

    optionsBuilder.add({ 'identifier':'4363401d-e69e-4c75-9fed-f75e44540b5d' })
    expect(optionsBuilder.getPayload()).toEqual([
      {
        code: '4363401d-e69e-4c75-9fed-f75e44540b5d',
        quantity: 1,
        price: 0,
      },
    ])

    optionsBuilder.increment({ 'identifier':'4363401d-e69e-4c75-9fed-f75e44540b5d' })
    expect(optionsBuilder.getPayload()).toEqual([
      {
        code: '4363401d-e69e-4c75-9fed-f75e44540b5d',
        quantity: 2,
        price: 0,
      },
    ])
  })

  it('decrements options', () => {

    const optionsBuilder = new ProductOptionsBuilder(productOptions)

    optionsBuilder.add({ 'identifier':'4363401d-e69e-4c75-9fed-f75e44540b5d' })
    optionsBuilder.add({ 'identifier':'4363401d-e69e-4c75-9fed-f75e44540b5d' })
    expect(optionsBuilder.getPayload()).toEqual([
      {
        code: '4363401d-e69e-4c75-9fed-f75e44540b5d',
        quantity: 2,
        price: 0,
      },
    ])

    optionsBuilder.decrement({ 'identifier':'4363401d-e69e-4c75-9fed-f75e44540b5d' })
    expect(optionsBuilder.getPayload()).toEqual([
      {
        code: '4363401d-e69e-4c75-9fed-f75e44540b5d',
        quantity: 1,
        price: 0,
      },
    ])

    optionsBuilder.decrement({ 'identifier':'4363401d-e69e-4c75-9fed-f75e44540b5d' })
    expect(optionsBuilder.getPayload()).toEqual([])
  })

  it('replaces option', () => {

    const optionsBuilder = new ProductOptionsBuilder(productOptions)

    optionsBuilder.add({ 'identifier':'b3b58c52-5159-3173-96c2-24b5608acf37' })
    expect(optionsBuilder.getPayload()).toEqual([
      {
        code: 'b3b58c52-5159-3173-96c2-24b5608acf37',
        quantity: 1,
        price: 0,
      },
    ])

    optionsBuilder.add({ 'identifier':'e2855e88-64c4-343f-b70d-5579402cf14e' })
    expect(optionsBuilder.getPayload()).toEqual([
      {
        code: 'e2855e88-64c4-343f-b70d-5579402cf14e',
        quantity: 1,
        price: 0,
      },
    ])
  })

  it('validates options', () => {

    const optionsBuilder = new ProductOptionsBuilder(productOptions)

    expect(optionsBuilder.isValid()).toBe(false)

    optionsBuilder.add({ 'identifier':'4363401d-e69e-4c75-9fed-f75e44540b5d' })
    expect(optionsBuilder.getPayload()).toEqual([
      {
        code: '4363401d-e69e-4c75-9fed-f75e44540b5d',
        quantity: 1,
        price: 0,
      },
    ])
    expect(optionsBuilder.isValid()).toBe(false)

    optionsBuilder.add({ 'identifier':'b3b58c52-5159-3173-96c2-24b5608acf37' })
    expect(optionsBuilder.getPayload()).toEqual([
      {
        code: '4363401d-e69e-4c75-9fed-f75e44540b5d',
        quantity: 1,
        price: 0,
      }, {
        code: 'b3b58c52-5159-3173-96c2-24b5608acf37',
        quantity: 1,
        price: 0,
      },
    ])
    expect(optionsBuilder.isValid()).toBe(true)

    // ---

    const notMandatoryProductOptionsBuilder = new ProductOptionsBuilder(notMandatoryProductOptions)

    expect(notMandatoryProductOptionsBuilder.isValid()).toBe(true)

  })

  it('increments quantity when adding twice', () => {

    const optionsBuilder = new ProductOptionsBuilder(productOptions)

    optionsBuilder.add({ 'identifier':'4363401d-e69e-4c75-9fed-f75e44540b5d' })
    expect(optionsBuilder.getPayload()).toEqual([
      {
        code: '4363401d-e69e-4c75-9fed-f75e44540b5d',
        quantity: 1,
        price: 0,
      },
    ])

    optionsBuilder.add({ 'identifier':'4363401d-e69e-4c75-9fed-f75e44540b5d' })
    expect(optionsBuilder.getPayload()).toEqual([
      {
        code: '4363401d-e69e-4c75-9fed-f75e44540b5d',
        quantity: 2,
        price: 0,
      },
    ])
  })

  it('adding twice or increment should not affect price', () => {

    const optionsBuilder = new ProductOptionsBuilder(productOptions)

    optionsBuilder.add({ '@type':'MenuItem','name':'Bar','identifier':'4363401d-e69e-4c75-9fed-f75e44540b5d','offers':{ '@type':'Offer','price':30 } })
    expect(optionsBuilder.getPayload()).toEqual([
      {
        code: '4363401d-e69e-4c75-9fed-f75e44540b5d',
        quantity: 1,
        price: 30,
      },
    ])

    optionsBuilder.add({ '@type':'MenuItem','name':'Bar','identifier':'4363401d-e69e-4c75-9fed-f75e44540b5d','offers':{ '@type':'Offer','price':30 } })
    expect(optionsBuilder.getPayload()).toEqual([
      {
        code: '4363401d-e69e-4c75-9fed-f75e44540b5d',
        quantity: 2,
        price: 30,
      },
    ])

    optionsBuilder.increment({ '@type':'MenuItem','name':'Bar','identifier':'4363401d-e69e-4c75-9fed-f75e44540b5d','offers':{ '@type':'Offer','price':30 } })
    expect(optionsBuilder.getPayload()).toEqual([
      {
        code: '4363401d-e69e-4c75-9fed-f75e44540b5d',
        quantity: 3,
        price: 30,
      },
    ])
  })

  it('stops incrementing quantity when threshold is reached', () => {

    const optionsBuilder = new ProductOptionsBuilder(productOptions)

    optionsBuilder.add({ 'identifier':'4363401d-e69e-4c75-9fed-f75e44540b5d' })
    optionsBuilder.add({ 'identifier':'4363401d-e69e-4c75-9fed-f75e44540b5d' })

    expect(optionsBuilder.getPayload()).toEqual([
      {
        code: '4363401d-e69e-4c75-9fed-f75e44540b5d',
        quantity: 2,
        price: 0,
      },
    ])

    optionsBuilder.add({ 'identifier':'64b97ccc-0ff5-4577-a881-8a0a834fdf80' })
    optionsBuilder.add({ 'identifier':'64b97ccc-0ff5-4577-a881-8a0a834fdf80' })

    expect(optionsBuilder.getPayload()).toEqual([
      {
        code: '4363401d-e69e-4c75-9fed-f75e44540b5d',
        quantity: 2,
        price: 0,
      }, {
        code: '64b97ccc-0ff5-4577-a881-8a0a834fdf80',
        quantity: 2,
        price: 0,
      },
    ])

    optionsBuilder.add({ 'identifier':'2b1f2e13-c957-4786-8c48-d0a2b94806fd' })

    expect(optionsBuilder.getPayload()).toEqual([
      {
        code: '4363401d-e69e-4c75-9fed-f75e44540b5d',
        quantity: 2,
        price: 0,
      }, {
        code: '64b97ccc-0ff5-4577-a881-8a0a834fdf80',
        quantity: 2,
        price: 0,
      },
    ])
  })

  it('parses values range', () => {

    const optionsBuilder = new ProductOptionsBuilder(productOptions)

    expect(optionsBuilder.parseRange('[1,4]')).toEqual([ 1, 4 ])
    expect(optionsBuilder.parseRange('[0,4]')).toEqual([ 0, 4 ])
    expect(optionsBuilder.parseRange('[0,]')).toEqual([ 0, Infinity ])
    expect(optionsBuilder.parseRange('[1,]')).toEqual([ 1, Infinity ])
    expect(optionsBuilder.parseRange('[12,12]')).toEqual([ 12, 12 ])
  })

})
