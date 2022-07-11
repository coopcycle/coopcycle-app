import moment from 'moment'
import { cloneDeep, merge } from 'lodash'
import {
  selectAreDoneTasksHidden, selectAreFailedTasksHidden, selectFilteredTasks,
  selectIsTagHidden, selectTagNames, selectTags,
} from '../taskSelectors'


describe('Task Selectors', () => {
  const date = moment().format('YYYY-MM-DD')
  const baseState = {
    entities: {
      tasks: {
        date,
        items: {
          [ date ]: [
            { id: 1, status: 'DONE', tags: [] },
            { id: 2, status: 'TODO', tags: [{ name: 'foo', slug: 'foo' }] },
          ],
        },
      },
    },
    ui: {
      tasks: { excludeFilters: [] },
    },
  }

  describe('selectFilteredTasks', () => {
    test('returns full list when exclude object is empty', () => {
      const state = cloneDeep(baseState)
      expect(selectFilteredTasks(state)).toEqual(state.entities.tasks.items[date])
    })

    test('returns correctly filtered list for single filter', () => {
      const state = merge(
        cloneDeep(baseState),
        { ui: { tasks: { excludeFilters: [{ status: 'DONE' }] } } }
      )
      expect(selectFilteredTasks(state)).toEqual([state.entities.tasks.items[date][1]])
    })

    test('returns correctly filtered list for multiple filters', () => {
      const state = merge(
        cloneDeep(baseState),
        { ui: { tasks: { excludeFilters: [{ status: 'DONE' }, { status: 'TODO' }] } } }
      )
      expect(selectFilteredTasks(state)).toEqual([])
    })

    test('returns correctly filtered list for task filter', () => {
      const state = merge(
        cloneDeep(baseState),
        { ui: { tasks: { excludeFilters: [{ tags: 'foo' }] } } }
      )
      expect(selectFilteredTasks(state)).toEqual([state.entities.tasks.items[date][0]])
    })
  })

  describe('selectAreDoneTasksHidden', () => {
    test('correctly indicates presence of { status: \'DONE\' } filter', () => {
      const state = cloneDeep(baseState)
      expect(selectAreDoneTasksHidden(state)).toBe(false)

      const newState = merge(
        cloneDeep(baseState),
        { ui: { tasks: { excludeFilters: [{ status: 'DONE' }] } } }
      )
      expect(selectAreDoneTasksHidden(newState)).toBe(true)
    })
  })

  describe('selectAreFailedTasksHidden', () => {
    test('correctly indicates presence of { status: \'DONE\' } filter', () => {
      const state = cloneDeep(baseState)
      expect(selectAreFailedTasksHidden(state)).toBe(false)

      const newState = merge(
        cloneDeep(baseState),
        { ui: { tasks: { excludeFilters: [{ status: 'FAILED' }] } } }
      )
      expect(selectAreFailedTasksHidden(newState)).toBe(true)
    })
  })

  describe('selectTags', () => {
    test('Unique set left unchanged', () => {
      const state = merge(
        cloneDeep(baseState),
        {
          entities: {
            tasks: {
              items: {
                [ date ]: [
                  { id: 1, status: 'DONE', tags: [{ name: 'foo', slug: 'foo' }] },
                  { id: 2, status: 'DONE', tags: [{ name: 'bar', slug: 'bar' }] },
                ],
              },
            },
          },
        }
      )
      expect(selectTags(state)).toEqual([{ name: 'foo', slug: 'foo' }, { name: 'bar', slug: 'bar' }])
    })

    test('Duplicates removed', () => {
      const state = merge(
        cloneDeep(baseState),
        {
          entities: {
            tasks: {
              items: {
                [ date ]: [
                  { id: 1, status: 'DONE', tags: [{ name: 'foo', slug: 'foo' }] },
                  { id: 2, status: 'DONE', tags: [{ name: 'bar', slug: 'bar' }, { name: 'foo', slug: 'foo' }] },
                ],
              },
            },
          },
        }
      )
      expect(selectTags(state)).toEqual([{ name: 'foo', slug: 'foo' }, { name: 'bar', slug: 'bar' }])
    })
  })

  describe('selectTagNames', () => {
    test('selects tag names', () => {
      expect(selectTagNames(baseState)).toEqual(['foo'])

      const state = merge(
        cloneDeep(baseState),
        {
          entities: {
            tasks: {
              items: {
                [ date ]: [
                  { id: 1, status: 'DONE', tags: [{ name: 'foo', slug: 'foo' }, { name: 'bar', slug: 'baz' }] },
                ],
              },
            },
          },
        }
      )

      expect(selectTagNames(state)).toEqual([ 'foo', 'bar' ])
    })
  })

  describe('selectIsTagHidden', () => {
    test('always selects false when filter is empty', () => {
      const isTagHidden = selectIsTagHidden(baseState)
      expect(isTagHidden('foo')).toBe(false)
      expect(isTagHidden('bar')).toBe(false)
      expect(isTagHidden('baz')).toBe(false)
      expect(isTagHidden('')).toBe(false)
    })

    test('selector determines whether tag is in filter list', () => {
      const state = merge(
        cloneDeep(baseState),
        { ui: { tasks: { excludeFilters: [{ tags: 'boo' }] } } },
      )

      const isTagHidden = selectIsTagHidden(state)

      expect(isTagHidden('foo')).toBe(false)
      expect(isTagHidden('iowegn')).toBe(false)
      expect(isTagHidden('eiowfn')).toBe(false)
      expect(isTagHidden('30r2sa')).toBe(false)
      expect(isTagHidden('boo')).toBe(true)
    })
  })
})
