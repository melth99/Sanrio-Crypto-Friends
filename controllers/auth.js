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
router.post('/sign-in', async function (req, res) {
    const userInDB = await UserModel.findOne({ userName: req.body.username })
    if (!userInDB) {
        res.send("sorry error username db") //change for security later
        return
    }
    if (!bcrypt.compareSync(userInDB.password, req.body.password)) {
        res.send('sorry error pw!') //change for security later
        return
    }
    req.session.user = {
        userSession: userInDB.userName,
        _id: userInDB._id
    }
    res.redirect('/')
})


router.get('/home', function (req, res) {
    res.render('/auth/inside.ejs')
})

router.post('/sign-up', async function (req, res) {
    const userInDB = await UserModel.findOne({ userName: req.body.userName })


    if (req.body.password !== req.body.confirmPassword) {
        return res.send('Passwords must match')
    }
    //encrypts password
    hashedPW = bcrypt.hashSync(req.body.password, 10)
    req.body.password = hashedPW


    userDoc = await UserModel.create(req.body)
    // An instance of a model is called a document. Creating them and saving to the database is easy.

    console.log(userDoc)

    // validate email is in format later

})

/*
router.post('sign-in', (req, res) => {

})
*/

router.get('/new-portfolio', function (req, res) {
    res.render('auth/portfolio/new-portfolio.ejs')
})

router.post('/new-portfolio', async function (req, res) {
    try {
        const existingPort = await UserModel.findOne({ portName: req.body.portName })

        if (existingPort) {
            return res.send("You already have a portfolio with that name silly!")
        }
        const userPort = await UserModel.create(req.body)
        console.log(userPort)
        res.redirect('/all-portfolios') //need to carry data to view portfolio but it is rendering
    }
    catch (error) {
        console.error(error);
        res.send('portfolio not made! error', error)

    }
})
//ID functionality
router.put('/:portfolioId', async function (res, req) {
    console.log(req.body)
    foundPort = UserModel.findByIdAndUpdate(req.body.portfolioId, req.body, { new: true })
    console.log(foundPort)
    res.redirect(`/portfolios/${foundPort._id}`)

})

router.get('/portfolios', async function (req, res) { //needs id functionality to pubish i think? office hours maybe
    allPorts = await UserModel.find({}, 'portfolio')
    res.render('auth/portfolio/portfolios.ejs', { allPorts: allPorts })
})





// router will have all the http endpoints setup up on it for a particular resource, and we'll use the router in the server
module.exports = router