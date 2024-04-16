import { act, renderHook } from '@testing-library/react-native';
import useProductOptionsBuilder from '../ProductOptionsBuilder';

const productOptions = [
  {
    '@type': 'MenuSection',
    name: 'Accompagnement',
    identifier: '62b16b74-22a9-39d3-898a-eca602602169',
    additionalType: 'free',
    additional: false,
    hasMenuItem: [
      {
        '@type': 'MenuItem',
        name: 'Frites',
        identifier: 'b3b58c52-5159-3173-96c2-24b5608acf37',
        offers: { '@type': 'Offer', price: 0 },
      },
      {
        '@type': 'MenuItem',
        name: 'Petits pois',
        identifier: 'e2855e88-64c4-343f-b70d-5579402cf14e',
        offers: { '@type': 'Offer', price: 0 },
      },
      {
        '@type': 'MenuItem',
        name: 'Purée',
        identifier: '29bbf16b-d432-3900-8301-9f6b696b8d51',
        offers: { '@type': 'Offer', price: 0 },
      },
      {
        '@type': 'MenuItem',
        name: 'Salade',
        identifier: '49f77d10-336e-38e9-a620-ad30618de271',
        offers: { '@type': 'Offer', price: 0 },
      },
      {
        '@type': 'MenuItem',
        name: 'Salade',
        identifier: 'e588ec20-9b0e-3ec6-8164-bdfafdf4b440',
        offers: { '@type': 'Offer', price: 0 },
      },
    ],
  },
  {
    '@type': 'MenuSection',
    name: 'Ingrédients',
    identifier: '3da98061-b57a-48c1-9c7b-1a26b1cd8962',
    additionalType: 'free',
    additional: true,
    valuesRange: '[1,4]',
    hasMenuItem: [
      {
        '@type': 'MenuItem',
        name: 'Bar',
        identifier: '4363401d-e69e-4c75-9fed-f75e44540b5d',
        offers: { '@type': 'Offer', price: 0 },
      },
      {
        '@type': 'MenuItem',
        name: 'Bat',
        identifier: '64b97ccc-0ff5-4577-a881-8a0a834fdf80',
        offers: { '@type': 'Offer', price: 0 },
      },
      {
        '@type': 'MenuItem',
        name: 'Baz',
        identifier: '2b1f2e13-c957-4786-8c48-d0a2b94806fd',
        offers: { '@type': 'Offer', price: 0 },
      },
      {
        '@type': 'MenuItem',
        name: 'Foo',
        identifier: '8c68f1e4-3cac-48db-b030-9dce70d052e5',
        offers: { '@type': 'Offer', price: 0 },
      },
    ],
  },
  {
    '@type': 'MenuSection',
    name: 'Suppléments',
    identifier: '3da98061-b57a-48c1-9c7b-1a26b1cd8963',
    additionalType: 'free',
    additional: true,
    valuesRange: '[0,4]',
    hasMenuItem: [
      {
        '@type': 'MenuItem',
        name: 'Bar',
        identifier: '4363401d-e69e-4c75-9fed-f75e44540b5e',
        offers: { '@type': 'Offer', price: 0 },
      },
      {
        '@type': 'MenuItem',
        name: 'Bat',
        identifier: '64b97ccc-0ff5-4577-a881-8a0a834fdf81',
        offers: { '@type': 'Offer', price: 0 },
      },
      {
        '@type': 'MenuItem',
        name: 'Baz',
        identifier: '2b1f2e13-c957-4786-8c48-d0a2b94806fe',
        offers: { '@type': 'Offer', price: 0 },
      },
      {
        '@type': 'MenuItem',
        name: 'Foo',
        identifier: '8c68f1e4-3cac-48db-b030-9dce70d052e4',
        offers: { '@type': 'Offer', price: 0 },
      },
    ],
  },
];

const notMandatoryProductOptions = [
  {
    '@type': 'MenuSection',
    name: 'Sauces',
    identifier: 'SAUCES',
    additionalType: 'free',
    additional: true,
    valuesRange: '[0,4]',
    hasMenuItem: [
      {
        '@type': 'MenuItem',
        name: 'Mayo',
        identifier: 'MAYO',
        offers: { '@type': 'Offer', price: 0 },
      },
      {
        '@type': 'MenuItem',
        name: 'Ketchup',
        identifier: '64b97ccc-0ff5-4577-a881-8a0a834fdf81',
        offers: { '@type': 'Offer', price: 0 },
      },
      {
        '@type': 'MenuItem',
        name: 'Mustard',
        identifier: '2b1f2e13-c957-4786-8c48-d0a2b94806fe',
        offers: { '@type': 'Offer', price: 0 },
      },
      {
        '@type': 'MenuItem',
        name: 'Foo',
        identifier: '8c68f1e4-3cac-48db-b030-9dce70d052e4',
        offers: { '@type': 'Offer', price: 0 },
      },
    ],
  },
];

const addMandatoryNonAdditional = hook => {
  act(() => {
    hook.current.add({ identifier: 'b3b58c52-5159-3173-96c2-24b5608acf37' });
  });
};

const replaceMandatoryNonAdditional = hook => {
  act(() => {
    hook.current.add({ identifier: 'e2855e88-64c4-343f-b70d-5579402cf14e' });
  });
};

const incrementMandatoryAdditional = hook => {
  act(() => {
    hook.current.increment({
      identifier: '4363401d-e69e-4c75-9fed-f75e44540b5d',
    });
  });
};

const decrementMandatoryAdditional = hook => {
  act(() => {
    hook.current.decrement({
      identifier: '4363401d-e69e-4c75-9fed-f75e44540b5d',
    });
  });
};

const incrementNonMandatoryAdditional = hook => {
  act(() => {
    hook.current.increment({
      identifier: '4363401d-e69e-4c75-9fed-f75e44540b5d',
    });
  });
};

describe('ProductOptionsBuilder', () => {
  it('adds options', () => {
    const { result } = renderHook(() =>
      useProductOptionsBuilder(productOptions),
    );

    act(() => {
      result.current.add({
        identifier: '4363401d-e69e-4c75-9fed-f75e44540b5d',
      });
    });

    expect(result.current.selected).toEqual([
      {
        code: '4363401d-e69e-4c75-9fed-f75e44540b5d',
        quantity: 1,
        price: 0,
      },
    ]);

    act(() => {
      result.current.add({
        identifier: '64b97ccc-0ff5-4577-a881-8a0a834fdf80',
      });
    });

    expect(result.current.isValid).toBe(false);
    expect(result.current.selected).toEqual([
      {
        code: '4363401d-e69e-4c75-9fed-f75e44540b5d',
        quantity: 1,
        price: 0,
      },
      {
        code: '64b97ccc-0ff5-4577-a881-8a0a834fdf80',
        quantity: 1,
        price: 0,
      },
    ]);
  });

  it('replaces option', () => {
    const { result } = renderHook(() =>
      useProductOptionsBuilder(productOptions),
    );

    act(() => {
      result.current.add({
        identifier: 'b3b58c52-5159-3173-96c2-24b5608acf37',
      });
    });

    expect(result.current.selected).toEqual([
      {
        code: 'b3b58c52-5159-3173-96c2-24b5608acf37',
        quantity: 1,
        price: 0,
      },
    ]);

    act(() => {
      result.current.add({
        identifier: 'e2855e88-64c4-343f-b70d-5579402cf14e',
      });
    });

    expect(result.current.selected).toEqual([
      {
        code: 'e2855e88-64c4-343f-b70d-5579402cf14e',
        quantity: 1,
        price: 0,
      },
    ]);
  });

  it('increments options', () => {
    const { result } = renderHook(() =>
      useProductOptionsBuilder(productOptions),
    );

    act(() => {
      result.current.add({
        identifier: '4363401d-e69e-4c75-9fed-f75e44540b5d',
      });
    });

    expect(result.current.selected).toEqual([
      {
        code: '4363401d-e69e-4c75-9fed-f75e44540b5d',
        quantity: 1,
        price: 0,
      },
    ]);

    act(() => {
      result.current.increment({
        identifier: '4363401d-e69e-4c75-9fed-f75e44540b5d',
      });
    });

    expect(result.current.selected).toEqual([
      {
        code: '4363401d-e69e-4c75-9fed-f75e44540b5d',
        quantity: 2,
        price: 0,
      },
    ]);
  });

  it('increments quantity when adding twice', () => {
    const { result } = renderHook(() =>
      useProductOptionsBuilder(productOptions),
    );

    act(() => {
      result.current.add({
        identifier: '4363401d-e69e-4c75-9fed-f75e44540b5d',
      });
    });

    expect(result.current.selected).toEqual([
      {
        code: '4363401d-e69e-4c75-9fed-f75e44540b5d',
        quantity: 1,
        price: 0,
      },
    ]);

    act(() => {
      result.current.add({
        identifier: '4363401d-e69e-4c75-9fed-f75e44540b5d',
      });
    });

    expect(result.current.selected).toEqual([
      {
        code: '4363401d-e69e-4c75-9fed-f75e44540b5d',
        quantity: 2,
        price: 0,
      },
    ]);
  });

  it('adding twice or increment should not affect price', () => {
    const { result } = renderHook(() =>
      useProductOptionsBuilder(productOptions),
    );

    act(() => {
      result.current.add({
        '@type': 'MenuItem',
        name: 'Bar',
        identifier: '4363401d-e69e-4c75-9fed-f75e44540b5d',
        offers: { '@type': 'Offer', price: 30 },
      });
    });

    expect(result.current.selected).toEqual([
      {
        code: '4363401d-e69e-4c75-9fed-f75e44540b5d',
        quantity: 1,
        price: 30,
      },
    ]);

    act(() => {
      result.current.add({
        '@type': 'MenuItem',
        name: 'Bar',
        identifier: '4363401d-e69e-4c75-9fed-f75e44540b5d',
        offers: { '@type': 'Offer', price: 30 },
      });
    });

    expect(result.current.selected).toEqual([
      {
        code: '4363401d-e69e-4c75-9fed-f75e44540b5d',
        quantity: 2,
        price: 30,
      },
    ]);

    act(() => {
      result.current.increment({
        '@type': 'MenuItem',
        name: 'Bar',
        identifier: '4363401d-e69e-4c75-9fed-f75e44540b5d',
        offers: { '@type': 'Offer', price: 30 },
      });
    });

    expect(result.current.selected).toEqual([
      {
        code: '4363401d-e69e-4c75-9fed-f75e44540b5d',
        quantity: 3,
        price: 30,
      },
    ]);
  });

  it('stops incrementing quantity when threshold is reached', () => {
    const { result } = renderHook(() =>
      useProductOptionsBuilder(productOptions),
    );

    act(() => {
      result.current.add({
        identifier: '4363401d-e69e-4c75-9fed-f75e44540b5d',
      });
    });

    act(() => {
      result.current.add({
        identifier: '4363401d-e69e-4c75-9fed-f75e44540b5d',
      });
    });

    expect(result.current.selected).toEqual([
      {
        code: '4363401d-e69e-4c75-9fed-f75e44540b5d',
        quantity: 2,
        price: 0,
      },
    ]);

    act(() => {
      result.current.add({
        identifier: '64b97ccc-0ff5-4577-a881-8a0a834fdf80',
      });
    });

    act(() => {
      result.current.add({
        identifier: '64b97ccc-0ff5-4577-a881-8a0a834fdf80',
      });
    });

    expect(result.current.selected).toEqual([
      {
        code: '4363401d-e69e-4c75-9fed-f75e44540b5d',
        quantity: 2,
        price: 0,
      },
      {
        code: '64b97ccc-0ff5-4577-a881-8a0a834fdf80',
        quantity: 2,
        price: 0,
      },
    ]);

    act(() => {
      result.current.add({
        identifier: '2b1f2e13-c957-4786-8c48-d0a2b94806fd',
      });
    });

    expect(result.current.selected).toEqual([
      {
        code: '4363401d-e69e-4c75-9fed-f75e44540b5d',
        quantity: 2,
        price: 0,
      },
      {
        code: '64b97ccc-0ff5-4577-a881-8a0a834fdf80',
        quantity: 2,
        price: 0,
      },
    ]);
  });

  it('decrements options', () => {
    const { result } = renderHook(() =>
      useProductOptionsBuilder(productOptions),
    );

    act(() => {
      result.current.add({
        identifier: '4363401d-e69e-4c75-9fed-f75e44540b5d',
      });
    });
    act(() => {
      result.current.add({
        identifier: '4363401d-e69e-4c75-9fed-f75e44540b5d',
      });
    });

    expect(result.current.selected).toEqual([
      {
        code: '4363401d-e69e-4c75-9fed-f75e44540b5d',
        quantity: 2,
        price: 0,
      },
    ]);

    act(() => {
      result.current.decrement({
        identifier: '4363401d-e69e-4c75-9fed-f75e44540b5d',
      });
    });

    expect(result.current.selected).toEqual([
      {
        code: '4363401d-e69e-4c75-9fed-f75e44540b5d',
        quantity: 1,
        price: 0,
      },
    ]);

    act(() => {
      result.current.decrement({
        identifier: '4363401d-e69e-4c75-9fed-f75e44540b5d',
      });
    });

    expect(result.current.selected).toEqual([]);
  });

  describe("options: 1 mandatory 'not additional'; 1 mandatory 'additional'; 1 not mandatory 'additional'", () => {
    let hook;

    beforeEach(() => {
      const { result } = renderHook(() =>
        useProductOptionsBuilder(productOptions),
      );
      hook = result;
    });

    describe('nothing selected', () => {
      it('is not valid (missing mandatory options)', () => {
        expect(hook.current.isValid).toBe(false);
      });
    });

    describe("adds: 1 mandatory 'not additional'", () => {
      beforeEach(() => {
        addMandatoryNonAdditional(hook);
      });

      it("is not valid (missing 1 mandatory 'additional')", () => {
        expect(hook.current.isValid).toBe(false);
      });

      describe("adds: 1 mandatory 'additional'", () => {
        beforeEach(() => {
          incrementMandatoryAdditional(hook);
        });

        it('is valid', () => {
          expect(hook.current.isValid).toBe(true);
        });

        describe("removes: 1 mandatory 'additional'", () => {
          beforeEach(() => {
            decrementMandatoryAdditional(hook);
          });

          it("is not valid (missing 1 mandatory 'additional')", () => {
            expect(hook.current.isValid).toBe(false);
          });
        });

        describe("replaces: 1 mandatory 'not additional'", () => {
          beforeEach(() => {
            replaceMandatoryNonAdditional(hook);
          });
          it('is valid', () => {
            expect(hook.current.isValid).toBe(true);
          });
        });
      });
    });

    describe("adds: 1 mandatory 'additional'", () => {
      beforeEach(() => {
        incrementMandatoryAdditional(hook);
      });

      it("is not valid (missing 1 mandatory 'not additional')", () => {
        expect(hook.current.isValid).toBe(false);
      });

      describe("adds: 1 mandatory 'additional'; 1 mandatory 'not additional'", () => {
        beforeEach(() => {
          addMandatoryNonAdditional(hook);
        });

        it('is valid', () => {
          expect(hook.current.isValid).toBe(true);
        });
      });
    });

    describe("adds: 1 not mandatory 'additional'", () => {
      beforeEach(() => {
        incrementNonMandatoryAdditional(hook);
      });

      it('is not valid (missing mandatory options)', () => {
        expect(hook.current.isValid).toBe(false);
      });
    });
  });

  describe('no mandatory options', () => {
    it('isValid', () => {
      const { result } = renderHook(() =>
        useProductOptionsBuilder(notMandatoryProductOptions),
      );

      expect(result.current.isValid).toBe(true);
    });
  });
});
