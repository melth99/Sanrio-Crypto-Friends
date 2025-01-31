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
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
})




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
    coins: [coinSchema]
})

const User = new mongoose.model('User', userSchema)




module.exports = User