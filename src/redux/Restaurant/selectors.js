import { createSelector } from 'reselect'
import { find } from 'lodash'
import moment from 'moment'

const _selectDate = state => state.restaurant.date
const _selectSpecialOpeningHoursSpecification = state => state.restaurant.specialOpeningHoursSpecification

export const selectSpecialOpeningHoursSpecification = createSelector(
  _selectDate,
  _selectSpecialOpeningHoursSpecification,
  (date, specialOpeningHoursSpecification) => {

    if (specialOpeningHoursSpecification.length === 0) {

      return null
    }

    return find(specialOpeningHoursSpecification, openingHoursSpecification => {

      return date.isSame(moment(openingHoursSpecification.validFrom, 'YYYY-MM-DD'), 'day')
    })
  }
)

