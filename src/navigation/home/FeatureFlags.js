import React from 'react'
import { Checkbox, Column } from 'native-base'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

export default function FeatureFlags() {
  const { t } = useTranslation()

  const dispatch = useDispatch()

  return (
    <Column m={4}>
    </Column>
  )
}
