
//Dependencies

const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');
const fetch = require('node-fetch');
const axios = require('axios');
let bodyParser = require('body-parser')
const userStocks = require('../models/userTickerSchema.js');
const seedTest = require('../models/sampleEntries');
const { send } = require('node:process');
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
const profile = 'profile/'
const news = 'stock_news?tickers='


let search_array = []
//Create seed data
  router.get('/seed', (req,res)=>{
    userStocks.create(seedTest,(error, test_data)=>{
      console.log('get the data: ', test_data);
      data: test_data;
    })
  })
  //get all data in userStocks
  router.get('/alldata', (req, res)=>{
    userStocks.find({}, (error, data)=>{
      res.json(data)
    })
  })
  //Respond to front end search requests

  router.route('/')
    .post((req, res) => receiveSearch(req, res))
    .get((req, res) => sendSearchData(req,res))

  receiveSearch = (req, res) => {
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
  }
  sendSearchData = (req, res) => {
    //Attempt on not allowing the front end to query the same result after the first try, bug not fixed
    const waitSearch = async (query) => {
      if (search_array.length > 1) {
        const data = await search_array
        console.log(data)
        res.send(data)
      }
    }
    waitSearch()
  
  }

//Initial sample news output below for index
let index_tickers = ['AAPL', 'NFLX', 'GOOGL','JPM', 'AMZN']
  router.get('/tickerindex', (req, res)=>{
    //set an array to gather random ticker for the index page
    let indx_array = []
    const rand_ticker = index_tickers[Math.floor(Math.random()* index_tickers.length)]
    console.log(rand_ticker)
    
    //gather company profile and news for random ticker for the index page
    const getProfile_News = async (query) =>{
        const response_profile = await fetch(
          `${url}profile/${query}?apikey=${key}`
        )
        const data_profile = await response_profile.json()
        console.log(data_profile)
        //Create new object within index_array to send data to
        indx_array.push({"Profile": data_profile, "Press_Release": "Great"})
        const response_news = await fetch(
            `${url}${news}${query}${limit}&apikey=${key}`
        )
        const data_news = await response_news.json()
        console.log(data_news)
        //Update Press_Release Key with new data_news
        indx_array[0].Press_Release = data_news
        console.log(indx_array)
        res.send(indx_array)
    }
    getProfile_News(rand_ticker)

  })

//Change sample ouput on index once a user clicks on a search result
 
  router.route('/indexchange')

    .post((req, res) => IndexChange(req, res))
    .get((req, res) => IndexData(req,res))

  IndexChange = (req, res) => {
    let index_update = [];
    const updateProfile_News = async (query) =>{
      const response_profile = await fetch(
        `${url}profile/${query}?apikey=${key}`
      )
      const data_profile = await response_profile.json()
      console.log('Testing IndexChange')
      console.log(data_profile)
    }
    updateProfile_News(req.body.search)
    
  }
  IndexData = (req, res) => {
        res.send(index_update)
  }
//
router.post('/savefavorites', async (req, res) => {
  //Test cases for testing if a user is found - saving these for future use cases
    // const user = await userStocks.findOne({email: "email@test.com"})
    // const user2 = await userStocks.findOne({email: "michael@test.com"})
    // // console.log(userStocks.findOne({IDBCursorWithValue}))
    // console.log(user)
    // console.log(user2)
    // console.log(user.email)
    // if(user2 == null){
    //   console.log('found successful test case for savefavorites route')
    // }
    // await userStocks.findOneAndUpdate({email: "email@test.com"},{$push: {tickerarray: 'NFLX'}}, {useFindAndModify: false})
    // if(userStocks.find({ _id : "6114613b7d5cef0fab80dc09"}) == true){
    //   console.log('id found')
    // } else {console.log('id not found')}

  const user = await userStocks.findOne({email: req.body.email})
  if(user == null){
    userStocks.create([{
      name: req.body.name,
      email: req.body.email,
      investmentAmount: 1000,
      tickerarray: req.body.ticker
    }])
  } else{ 
    await userStocks.findOneAndUpdate({email: req.body.email},{$push: {tickerarray: req.body.ticker}}, {useFindAndModify: false})
  }

  res.send(`Created / Updated profile for ${req.body.email}`)
} )

router.patch('/:favId', async (req, res)=>{
  // const favId = req.params.favId
  // const deleteFavStock = await userStocks.findOne({_id: "6114613b7d5cef0fab80dc09"})
  // console.log(deleteFavStock)
  // await userStocks.findByIdAndUpdate({_id:"6114613b7d5cef0fab80dc09"},{$pull:{tickerarray: "NFLX"}},{useFindAndModify: false})
  // console.log(deleteFavStock)
  const patchFavStock = await userStocks.findByIdAndUpdate({_id: req.params.favId},
  {$pull:{tickerarray: req.body.ticker}}, {useFindAndModify: false})
  res.json(patchFavStock)
})

module.exports = router;

    // indx_array.push({"Profile":data, "Press_Release": "Great"})
    // indx_array[0].Press_Release = data2
    // let new_test = []
    // for(let i = 0; i < data.baselength; i++){
    //   //pass array and fill it with info, once complete push to new array
    //   api_call1(data[i]) //going to rewrite new_test
    //   //if i = 0 then run with an api call that rewrites new_test
    //   //if i > 0 push to new_test
    //   api_call2(data[i])
    //   //push to new_test
    // }