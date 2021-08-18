////////Stocks Today Backend //////////

// Import Dependencies
const express = require('express');
const router = express.Router();

const PORT = process.env.PORT || 4000;
const URI = process.env.MONGODB_URI ;
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const cors = require("cors")
require('dotenv').config();
let bodyParser = require('body-parser')
//Create App
const app = express();

// Middleware
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(cors())

// Controllers
const userController = require('./controllers/userticker.js')
app.use('/user', userController);

app.get('/', (req, res) => {
    res.send('server is working, lets keep working on this. You got it! :)')
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});
//|| 'mongodb://localhost:27017/stocks_today'
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open', () => {
    console.log('connected to mongo')
})


