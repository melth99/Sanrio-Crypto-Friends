
const express = require("express")
const app = express()
const dotenv = require("dotenv")
dotenv.config()
const mongoose = require("mongoose")

const methodOverride = require("method-override")
const morgan = require("morgan")
const session = require('express-session')
const cors = require('cors')
const axios = require('axios')
const baseURL = 'http://api.coinlayer.com/'
const port = process.env.PORT ? process.env.PORT : "3000";
const path = require('path');
mongoose.connect(process.env.MONGODB_URI)


mongoose.connection.on("connected", () => {

});
//convert
app.get(`/convert/:coinFrom/:coinTo/:fromQuantity`, async (req, res) => {


  //const fromQuantity = 100
  //const whatDay = ''
  // const before = '20-03-31'
  try {
      const { coinFrom, coinTo, fromQuantity } = req.params
      const response = await axios.get(`${baseURL}convert`, {
          params: {
              access_key: process.env.ACCESS_KEY,
              from: coinFrom,
              to: coinTo,
              amount: fromQuantity,
          }
      });
      const json = response.data;

      if (json.rates && json.rates[coinTo]) {
          console.log(`Exchange Rate (${coinFrom} to  ${coinTo}):`, json.rates[coinTo]);
      } else {
          console.log("Rates data not available:", json);
      }
  } catch (err) {
      console.error("Error:", err.message)
  }
})

//live
app.get(`/list`, async (req, res) => {

  /*      timestamp -exact utc timestamp
          default target for specified currency
          exchange rate
          high/low ER- highest/lowest midpoint exchange rate on that day 
          volume - volume of cryptocurrency exchanged on requested date
          market cap - total value of crypto currency
      
           //console.log(json) //prints all currency data as wll as each cryptocurrency
           //console.log(json.fiat)//prints currency fiat refers to value in traditional currency
           //console.log(json.fiat.NAD) // returns full name of currency using short hand as a key in json
           //console.log(json.crypto[coinSymbol]) // different for fetch live.
           //console.log(`${Object.keys(json.crypto)},`) //all crypto symbols */
  try {
      const response = await axios.get(`${baseURL}list`, {
          params: {
              access_key: process.env.ACCESS_KEY,
              expand: 1
          }
      });
      const json = response.data;
      res.json(json)

      if (json) {
          console.log(`${Object.keys(json.crypto)} `)
      } else {
          console.log("Failed request :(", json);
      }
  } catch (err) {
      console.error("Error:", err.message)
  }
})

app.get(`/live/:symbols?/:target?`, async (req, res) => {
  const target = req.params.target || 'USD'
  const symbols = req.params.symbols || ''
  //if routing with a specific target(fiat) but no specific coin - 
  // use this template '/live/?/USD'
  // http://localhost:3000/live/ETH,TESLA/JPY - USE THIS syntax for routing with multiple coins
  try {
      const response = await axios.get(`${baseURL}live`, {
          params: {
              access_key: process.env.ACCESS_KEY,
              symbols: symbols,
              target: target,
             // expand: 1
          }
      });
      const json = response.data;
      res.json(json)

      if (json) {
          //  console.log(`${Object.keys(json.crypto)} `)
          console.log(json)
      } else {
          console.log("Failed request :(", json);
      }
  } catch (err) {
      console.error("Error:", err.message)
  }
})

app.get('/historical/:date/:target?/:symbols?', async (req, res) => {
  const date = req.params.date
  const target = req.params.target || 'USD'
  const symbols = req.params.symbols || ''
  try {
      const response = await axios.get(`${baseURL}${date}`, { // makes sure date param is first
          params: {
              //date: date,// YYYY-MM-DD format & required
              access_key: process.env.ACCESS_KEY,
              target: target, //default dollars fiat USES FIAT CODE
              symbols: symbols, //optional, but use this format if you choose" BTC,DOGE,ETH"
              expand: 1,



              //can do symbols if needed
          }
      })
      const json = response.data
      res.json(json)
      console.log(json)
  }
  catch (err) {
      console.error(err.message)
  }
})

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


app.use('/auth', authCtrl)
app.use('/coin', coinCtrl)



app.get('/', function (req, res) {

  res.render('welcome.ejs', { user: req.session.user });
});


app.listen(port, () => {

})
