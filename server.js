
const express = require("express")
const app = express()
const dotenv = require("dotenv")
dotenv.config()
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const morgan = require("morgan")
const session = require('express-session')

const port = process.env.PORT ? process.env.PORT : "3000";
const path = require('path');
mongoose.connect(process.env.MONGODB_URI)
const baseURL = 'http://api.coinlayer.com/'


mongoose.connection.on("connected", () => {

});




const authCtrl = require('./controllers/auth')

const coinCtrl = require('./controllers/coin')


app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));



app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);








app.use(express.urlencoded({ extended: false }));

app.use(methodOverride("_method"));

app.use(morgan('dev'));


app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,

}))

//FETCH CATCH COINLAYER API GOES HERE

//start date
// this code is only on the professional plan :(
async function timeframeData() {
  const startDate = '2025-01-22' //input from new coin page goes here using this date for now
  const endDate = '2025-01-24' //Date.now()
  endpoint = 'timeframe'
  const reqURL = baseURL + endpoint + '?' + 'access_key='+process.env.ACCESS_KEY + '&start_date' + startDate + '&end_date' + endDate + ' &symbols = BTC,ETH'

  fetch(reqURL)
    .then(response => {
      if (!response.ok) {
        throw new Error('HTTP ERROR!!! USING COINLAYER:', response.status)
      } return response.json()
        .then(data => {
          console.log("here it is!!!!", data)
        })
        .catch(error => {
          console.error('error fetching data!', error)

        })
    })

}



timeframeData()

////////////////////////

app.use('/auth', authCtrl)
app.use('/coin', coinCtrl)


app.get('/', function (req, res) {

  res.render('welcome.ejs', { user: req.session.user });
});


app.listen(port, () => {

})
