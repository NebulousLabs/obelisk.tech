import * as _ from 'lodash'

const countries = require('i18n-iso-countries')

// Create country options for form below
countries.registerLocale(require('i18n-iso-countries/langs/en.json'))

const countriesDict = countries.getNames('en')

const filteredCountries = _.pickBy(countriesDict, (name, code2) => code2 !== 'UM')
let countriesArray = _.map(filteredCountries, (name, code2) => {
  const code3 = countries.alpha2ToAlpha3(code2)
  return {
    code2,
    code3,
    name,
  }
})

// Sort alphabetically
countriesArray.sort((a, b) => {
  const nameA = a.name
  const nameB = b.name
  return nameA.localeCompare(nameB)
})

countriesArray = _.filter(countriesArray, country => {
  switch (country.name) {
    case 'Iran, Islamic Republic of':
    case 'Cuba':
    case 'Sudan':
    case 'Syrian Arab Republic':
    case 'North Korea':
      // case 'Crimean Region of the Ukraine': ???
      return false
    default:
      return true
  }
})

export default countriesArray
