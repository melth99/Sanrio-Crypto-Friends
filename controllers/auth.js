express = require('express')
const router = express.Router()
const UserModel = require('../models/coins')



const bcrypt = require('bcrypt')

router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in.ejs')
})

router.get('/sign-up', function (req, res) {
    res.render('auth/sign-up.ejs')
})


router.post('/sign-in', async function (req, res) {
    const userInDB = await UserModel.findOne({ userName: req.body.username })
    if (!userInDB) {
        res.send("sorry error username db")
        return
    }

    if (!bcrypt.compareSync(req.body.password, userInDB.password)) {
        res.send('sorry error pw!')
        return
    }
    req.session.user = {
        userName: userInDB.userName,
        _id: userInDB._id
    }
    res.redirect('/')
})



router.post('/sign-up', async function (req, res) {



    if (req.body.password !== req.body.confirmPassword) {
        return res.send('Passwords must match')
    }

    hashedPW = bcrypt.hashSync(req.body.password, 10)
    req.body.password = hashedPW


    userDoc = await UserModel.create(req.body)
    res.render('welcome.ejs', ({ user: userDoc }))

})

module.exports = router