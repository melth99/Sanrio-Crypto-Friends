express = require('express')
const router = express.Router()
const UserModel = require('../models/coins')


// import this module to hash our passwords
const bcrypt = require('bcrypt')

router.get('/sign-in', (req, res) => {
    res.render('./auth/sign-in.ejs')
})

router.get('/sign-up', function (req, res) {
    res.render('./auth/sign-up.ejs')
})

router.post('/sign-up', async function (req, res) { 
    const userInDB = await UserModel.findOne({ userName: req.body.userName })


    if (req.body.password !== req.body.confirmPassword) {
        return res.send('Passwords must match')
    }
    //encrypts password
    hashedPW = bcrypt.hashSync(req.body.password,10)
    req.body.password = hashedPW

 
    userDoc = await UserModel.create(req.body) 
    // An instance of a model is called a document. Creating them and saving to the database is easy.
 
    console.log(userDoc)
    
    // validate email is in format later

})

router.post('sign-in', (res, req) => {

})




// router will have all the http endpoints setup up on it for a particular resource, and we'll use the router in the server
module.exports = router