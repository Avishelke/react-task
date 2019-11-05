const axios = require('axios');

const baseURL = 'https://swapi.co/api';

export const login = (user) =>
  axios.get(baseURL + `/people/?search=${user}`)

export const search = (searchValue) =>
  axios.get(baseURL + `/planets?search=${searchValue}`)
