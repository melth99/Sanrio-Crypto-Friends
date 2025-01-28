const mongoose = require('mongoose')

const coinSchema = new mongoose.Schema({
    coinName: {
        type: String,
        required: true
    },
    shortName: {
        type: String,
        required: true,
    },
    cost: {
        type: Number,
        required: true
    },
    timeOfPurchase: {
        type: String, //string for now explore Date() on mdn
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
})
const portfolioSchema = new mongoose.Schema({
    portName: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    coins: [coinSchema] //one to many req.body()

})
//pull out coin to different file
//portfolio,coin.oush to update array of coins everytime i add a coin
// instead when coin is added find portfolio with matching name
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 10,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    portfolio: [portfolioSchema]
})

const User = new mongoose.model('User', userSchema)

//const Portfolio = new mongoose.model('Portfolio', 'portfolioSchema')
//const Coin = new mongoose.model('Coin', 'coinSchema')

module.exports = User