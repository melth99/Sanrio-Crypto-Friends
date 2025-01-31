express = require('express')
const router = express.Router()
const UserModel = require('../models/coins')


router.get('/new-coin', function (req, res) {

    res.render('auth/coin/new-coin.ejs')
})

router.get('/index', async function (req, res) {
    const user = await UserModel.findById(req.session.user._id, "coins")
    
    const allCoins = user.coins
    if (!allCoins) {
        res.send('you dont have any coins silly!')
    }
    else {
        



        res.render('auth/coin/coins.ejs', { allCoins: allCoins })
    }
})

router.post('/new-coin', async function (req, res) {
    try {
        if (!req.session.user) {
            return res.status(401).send("User not authenticated");
        }

        const user = await UserModel.findById(req.session.user._id);
        
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


        user.coins.push(newCoin);
        await user.save();
        
        

        res.redirect('./index');
    } catch (error) {
        console.error("Error adding new coin:", error);
        res.status(500).send("Error adding new coin");
    }
})

router.get('/:coinId', async function (req, res) {


    const user = await UserModel.findById(req.session.user._id, "coins")
    
    const foundCoin = await user.coins.find(coin => coin._id.toString() === req.params.coinId)
    
    res.render('auth/coin/show.ejs', { foundCoin: foundCoin })

})
router.get('/edit/:coinId', async function (req, res) {

    
    const user = await UserModel.findById(req.session.user._id, "coins")
    
    const selectedCoin = user.coins.find(coin => coin._id.toString() === req.params.coinId);
    res.render('auth/coin/edit.ejs', {
        user: user.userName,
        editId: selectedCoin._id,
        coinName: selectedCoin.coinName,
        shortName: selectedCoin.shortName,
        cost: selectedCoin.cost,
        timeOfPurchase: selectedCoin.timeOfPurchase,
        quantity: selectedCoin.quantity

    })

})

router.put('/edit/:coinId', async function (req, res) {
    const user = await UserModel.findOneAndUpdate(
        { _id: req.session.user._id, "coins._id": req.params.coinId },
        {
            $set: {
                "coins.$.quantity": req.body.quantity,
                "coins.$.timeOfPurchase": req.body.timeOfPurchase
            }
        },
        { new: true, runValidators: true }
    );
    updatedCoin = user.coins.find(coin => coin._id.toString() === req.params.coinId)
    
    res.render('auth/coin/show.ejs', { foundCoin: updatedCoin });

})
router.delete('/:coinId', async function (req, res) {
    const user = await UserModel.findById(req.session.user._id, "coins")

    const index = user.coins.findIndex(coin => coin._id.toString() === req.params.coinId);
    
    user.coins.splice(index, 1);
    
    await user.save()

    res.redirect('./index')
})


module.exports = router