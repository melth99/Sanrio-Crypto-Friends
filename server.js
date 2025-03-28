const express = require("express")
const app = express()
const dotenv = require("dotenv")
dotenv.config()
const mongoose = require("mongoose")
const cors = require('cors');
const methodOverride = require("method-override")
const morgan = require("morgan")
const session = require('express-session')

const axios = require('axios')
const baseURL = 'http://api.coinlayer.com/'
const port = process.env.PORT ? process.env.PORT : "3000";
const path = require('path');
mongoose.connect(process.env.MONGODB_URI)


mongoose.connection.on("connected", () => {

});

const corsOptions = {
  origin: 'http://localhost:5173', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Apply CORS middleware first
app.use(cors(corsOptions));

// Other middleware
/* app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev')); */


// Session middleware
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

//convert
app.get(`/convert/:coinFrom/:coinTo/:fromQuantity`, async (req, res) => {
  try {
    const { coinFrom, coinTo, fromQuantity } = req.params;
    console.log("Request Parameters:", req.params);

    const response = await axios.get(`${baseURL}convert`, {
      params: {
        access_key: process.env.ACCESS_KEY,
        from: coinFrom,
        to: coinTo,
        amount: fromQuantity,
      }
    });

    const json = response.data;

    if (json.success && json.result) {
      console.log(`Query ${fromQuantity} ${coinFrom} to ${coinTo})`);
      res.json({
        rate: json.info.rate,
        result: json.result,
        from: coinFrom,
        to: coinTo,
        amount: fromQuantity,
      });
    } else {
      console.log("Rates data not available:", json);
      res.status(404).json({ message: "Rates data not available" });
    }
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



app.get('/historical/:date/:target/:symbols', async (req, res) => {
  const date = req.params.date;
  const target = req.params.target || 'USD';
  const symbols = req.params.symbols || '';

  try {
    const response = await axios.get(`${baseURL}${date}`, {
      params: {
        access_key: process.env.ACCESS_KEY,
        target: target,
        symbols: symbols,
        expand: 1,
      }
    });

    const json = response.data;

    if (json.success) {
      console.log(`Historical data for ${date} and symbol ${symbols}`);

      if (json.rates[symbols]) {
        res.json({
          symbol: symbols,
          date: date,
          target: target,
          rate: json.rates[symbols],
          high: json.rates[symbols].high,
          low: json.rates[symbols].low,
          vol: json.rates[symbols].vol,
          cap: json.rates[symbols].cap,
          sup: json.rates[symbols].sup,
          change: json.rates[symbols].change,
          change_pct: json.rates[symbols].change_pct
        });
      } else {
        console.log("No data available for the specified symbol:", symbols);
        res.status(404).json({ message: "No data available for the specified symbol" });
      }
    } else {
      console.log("Failed to fetch historical data:", json);
      res.status(404).json({ message: "Historical data not available" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});


//list
/* app.get(`/list`, async (req, res) => { */

  /* timestamp -exact utc timestamp
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
/*   try {
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
//live
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
}) */
/* const authCtrl = require('./controllers/auth')

const coinCtrl = require('./controllers/coin')



app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,

})) */


/* app.use('/auth', authCtrl)
app.use('/coin', coinCtrl)


app.get('/', function (req, res) {

  res.render('welcome.ejs', { user: req.session.user });
}); */


app.listen(port, () => {
  console.log(`listening on ${port}`)
})

