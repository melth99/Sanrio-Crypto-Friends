express = require('express')
const router = express.Router()
const UserModel = require('../models/coins')


router.get('/new-coin', function (req, res) {

    res.render('auth/coin/new-coin.ejs')
})

router.get('/index', async function (req, res) {
    const user = await UserModel.findById(req.session.user._id, "coins")
    console.log(user)
    const allCoins = user.coins
    if (!allCoins){
        res.send('you dont have any coins silly!')
    }
    else{
    console.log(UserModel)
    // console.log(allPorts)
    //  console.log(allPorts._id)
    //res.send('yea')
    res.render('auth/coin/coins.ejs', { allCoins: allCoins })
    }
})

router.post('/new-coin', async function (req, res) {
    try {
        if (!req.session.user) {
            return res.status(401).send("User not authenticated");
        }

        const user = await UserModel.findById(req.session.user._id);
        console.log(user)
        if (!user) {
            return res.status(404).send("User not found");
        }

        const newCoin = {
            coinName: req.body.coinName,
            shortName: req.body.shortName,
            cost: req.body.cost,
            timeOfPurchase: req.body.timeOfPurchase,
            quantity: req.body.quantity
        };

        // Assuming the user has a portfolio array
        user.coins.push(newCoin);
        await user.save();
        console.log(newCoin)
        console.log(user)

        res.redirect('./index'); // Redirect to the coin index page
    } catch (error) {
        console.error("Error adding new coin:", error);
        res.status(500).send("Error adding new coin");
    }
})

router.get('/:coinId', async function (req, res) {

    // http://localhost:3000/coin/679c15a19899ed5d64bc43ba -beyonce
    const user = await UserModel.findById(req.session.user._id, "coins")
    console.log("user >>>>", user, "coinId >>>>>>", req.params.coinId)
    const foundCoin = await user.coins.find(coin => coin._id.toString() === req.params.coinId)
    console.log("foundPort", foundCoin)
    res.render('auth/coin/show.ejs', { foundCoin: foundCoin })

})
router.get('/edit/:coinId', async function (req, res) {
    //form to edit
    console.log(req.params)
    const foundUser = await UserModel.findOne({ "coins._id": req.params.coinId },{ "coin.$": 1, userName: 1 })
    console.log('found!', foundUser)
    const selectedCoin = foundUser.coins[0]; 1 //placeholder for the array index of the matched element.
    res.render('auth/coin/edit.ejs', {
        user: foundUser.userName,
        editId: selectedCoin._id,
        coinName: selectedCoin.coinName,
        shortName: selectedCoin.shortName,
        cost: selectedCoin.cost,
        timeOfPurchase: selectedCoin.timeOfPurchase,
        quantity: selectedCoin.quantity

    })
    /*
    coinName: req.body.coinName,
            shortName: req.body.shortName,
            cost: req.body.cost,
            timeOfPurchase: req.body.timeOfPurchase,
            quantity: req.body.quantity
    */
})

router.put('/edit/:coinId', async function (res, req) {
    // goes into db and edits data
    console.log(req.params)
    const foundUser = await UserModel.findOne({ "coin._id": req.params.coinoId }, { "coin.$": 1 })
    foundCoin = await UserModel.findById(req.params.coinId)
    console.log("FOUNDPORT", foundCoin)
    res.send(foundCoin)
})


module.exports = router