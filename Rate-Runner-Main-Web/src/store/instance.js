/* eslint-disable no-unused-vars */
import axios from 'axios';

const user = (window.localStorage.getItem('user')) ? JSON.parse(window.localStorage.getItem('user')) : '';
// const apiHost = 'https://raterunner.wicesupplychain.com/api';
const apiHost = 'http://127.0.0.1:5000/api';
const apiDevHost = 'http://161.246.58.243:9435';
const apiDevHostBAK = 'http://127.0.0.1:5000';
const apiLocal = 'http://localhost:5000';
const instance = axios.create({
  baseURL: apiDevHostBAK,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    Authorization: user.token
  }
});

export default instance;
