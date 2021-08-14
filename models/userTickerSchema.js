const mongoose = require('mongoose')

const userTickerSchema = new mongoose.Schema({
    name: String,
    email: String,
    ticker: String, 
    investmentAmount: Number,
    tickerarray: Array,
}, {timestamps: true});


const userTickerCollection = mongoose.model('userSchema', userTickerSchema)

module.exports = userTickerCollection