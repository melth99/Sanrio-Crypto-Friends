const mongoose = require('mongoose')

const coinsSchema = new mongoose.Schema({
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
    howManyCoins: {
        type: Number,
        required: true
    }
})
const Coins = new mongoose.Model('Coins',' coinsSchema')