express = require('express')
const router = express.Router()
const UserModel = require('../models/coins')

router.get('/new-portfolio', function (req, res) {
    res.render('auth/portfolio/new-portfolio.ejs')
})

router.post('/new-portfolio', async function (req, res) {
    try {
        if (!req.session || !req.session.user || !req.session.user._id) {
            console.log(req.session)
            console.log(req.session.user, " <<<<should not be here")
            console.log(req.session.user._id, "<<<<<should not be here")
            return res.status(401).send("we cant find that friend in sanrio :/");
        }
        const userOfPort = await UserModel.findById(req.session.user._id)
        console.log("userofport", userOfPort)
        const existingPort = await userOfPort.portfolio.findOne({ portfolio: req.body.portName })
        console.log(existingPort)
        if (existingPort) {
            return res.send("You already have a portfolio with that name silly!")
        }
        console.log("req.body", req.body)
        userOfPort.portfolio.push(req.body)
        await userOfPort.save() //await is used because save() returns a promise, and we want to wait for the save operation to complete before proceeding.
        console.log(userOfPort)
        console.log("Updated user portfolio", userOfPort.portfolio);
        res.status(201).send('Portfolio created successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating portfolio: ')


    }
})

router.get('/:portfolioID', function (req, res) {
    res.render('/show/auth/portfolio/show.ejs')
})

router.put('/:portfolioId', async function (res, req) {
    console.log(req.body)
    foundPort = await UserModel.findByIdAndUpdate(req.body.portfolioId, req.body, { new: true })
    console.log(foundPort)
    res.redirect(`/portfolios/${foundPort._id}`)

})

router.get('/index', async function (req, res) { //needs id functionality to pubish i think? office hours maybe
    allPorts = await UserModel.find({}, 'portfolio')
    res.render('auth/portfolio/portfolios.ejs', { allPorts: allPorts })
})

module.exports = router