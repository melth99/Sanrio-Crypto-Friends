express = require('express')
const router = express.Router()
const UserModel = require('../models/coins')

router.get('/new-portfolio', function (req, res) {
    res.render('auth/portfolio/new-portfolio.ejs')
})

router.get('/index', async function (req, res) {
    const allPorts = await UserModel.find({}, "portfolio")
    console.log(UserModel)
    // console.log(allPorts)
    //  console.log(allPorts._id)
    res.render('auth/portfolio/portfolios.ejs', { allPorts })
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
        const existingPort = await userOfPort.portfolio.find(port => port.portName === req.body.portName)
        if (existingPort) {
            return res.send("You already have a portfolio with that name silly!")
        }
        console.log("req.body", req.body)
        userOfPort.portfolio.push(req.body)
        await userOfPort.save() //await is used because save() returns a promise, and we want to wait for the save operation to complete before proceeding.
        console.log(userOfPort)
        console.log("Updated user portfolio", userOfPort.portfolio);
        //res.status(201).send('Portfolio created successfully');
        console.log('Portfolio created successfully')
        res.redirect('/portolios')
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating portfolio: ')
    }

})

router.get('/:portfolioId', async function (req, res) {

    const user = await UserModel.findOne({ "portfolio._id": req.params.portfolioId })
    console.log("user >>>>", user, "portfolioId >>>>>>", req.params.portfolioId)
    const foundPort = await user.portfolio.find(portfolio => portfolio._id.toString() === req.params.portfolioId)
    console.log("foundPort", foundPort)
    res.render('auth/portfolio/show.ejs', { foundPort: foundPort })

})
router.get('/edit/:portfolioId', async function (req, res) {
    //form to edit
    console.log(req.params)
    const foundUser = await UserModel.findOne({ "portfolio._id": req.params.portfolioId }, { "portfolio.$": 1 })
    console.log('found!', foundUser)
    const selectedPortfolio = foundUser.portfolio[0]; 1 //placeholder for the array index of the matched element.
    res.render('auth/portfolio/edit.ejs', {
        editId: selectedPortfolio._id,
        portName: selectedPortfolio.portName,
        currency: selectedPortfolio.currency
    })
})

router.put('/edit/:portfolioId', async function (res, req) {
    // goes into db and edits data
    console.log(req.params)
    const foundUser = await UserModel.findOne({ "portfolio._id": req.params.portfolioId }, { "portfolio.$": 1 })
    const editedPort = foundUser.
    foundPort = await UserModel.findById(req.params.portfolioId)
    console.log("FOUNDPORT", foundPort)
    res.send(foundPort)

    //res.redirect(`/${foundPort._id}`)

})


router.get('/index', async function (req, res) { //needs id functionality to pubish i think? office hours maybe
    allPorts = await UserModel.find({}, 'portfolio')
    res.render('auth/portfolio/show.ejs')
})

module.exports = router