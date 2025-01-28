express = require('express')
const router = express.Router()
// const UserModel = require('../models/user')

// import this module to hash our passwords
const bcrypt = require('bcrypt')

router.get('/sign-in', (req,res) => {
    res.render('./auth/sign-in.ejs')
})

router.get('/sign-up', (req,res) =>{
    res.render('./auth/sign-up.ejs')
})






// router will have all the http endpoints setup up on it for a particular resource, and we'll use the router in the server
module.exports = router