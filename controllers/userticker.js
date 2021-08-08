
//Dependencies

const express = require('express');
const router = express.Router();
const app = express();
const methodOverride = require('method-override');
const fetch = require('node-fetch');
const axios = require('axios');
let bodyParser = require('body-parser')
const userSchema = require('../models/userTickerSchema.js');
// require('dotenv').config();

//middleware
router.use(express.urlencoded({ extended: true}));
router.use(methodOverride('_method'));
router.use(express.json({
    type: ['application/json', 'text/plain']
  }))
router.use(bodyParser.json());

//Financial Model API
const url = 'https://financialmodelingprep.com/api/v3/';
const key = process.env.STOCKAPI_KEY;
const api_search = 'search?query=';
const test = 'microsoft';
const limit = '&limit=5';
const test_url = `${url}${api_search}${test}${limit}&apikey=${key}`
// console.log(test_url)
let search_array = []
  router.post('/', (req, res)=>{

    // console.log(key)
    // console.log(req.body)
    const getSearch = async (query) =>{
        const response = await fetch(
            `${url}${api_search}${query}${limit}&apikey=${key}`
        )
        const data = await response.json()
        console.log(data)
        search_array = data
        console.log('Testing search_array')
        console.log(search_array)
        
    }

    getSearch(req.body.search_query)
    res.json(search_array) //look up how to send back, send to /getsearch
  })
  router.get('/getsearch', (req,res)=>{
      console.log('testing get route after search')
      console.log(search_array)
      res.send(search_array)
  })


module.exports = router;