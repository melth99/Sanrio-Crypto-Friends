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
  origin: ['https://mycryptohaven.netlify.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Add this if you're using cookies/authentication
};
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
        access_key: process.env.access_key,
        from: coinFrom,
        to: coinTo,
        amount: fromQuantity,
      }
    });

    const json = response.data;

    if (json.success && json.result) {
      console.log(`Query ${fromQuantity} ${coinFrom} to ${coinTo})`);
      res.json({ //responding to front ends request
        rate: json.info.rate,
        result: json.result,
        from: coinFrom,
        to: coinTo,
        amount: fromQuantity,
      });
      console.log(json.info)
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
  console.log(date, target, symbols)
  try {
    const response = await axios.get(`${baseURL}${date}`, {
      params: {
        access_key: process.env.access_key,
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
app.get(`/list`, async (req, res) => {
  console.log('=== /list endpoint called ===');
  console.log('API key exists:', !!process.env.access_key);
  console.log('Base URL:', baseURL);
  
  try {
    const requestUrl = `${baseURL}list`;
    const params = {
      access_key: process.env.access_key,
      expand: 1
    };
    
    console.log('Making request to:', requestUrl);
    console.log('API key length:', process.env.access_key ? process.env.access_key.length : 'MISSING');
    
    // Add timeout to prevent Heroku H12 errors
    const response = await axios.get(requestUrl, { 
      params,
      timeout: 25000 // 25 second timeout (less than Heroku's 30s)
    });
    
    console.log('Response status:', response.status);
    console.log('Response data success:', response.data.success);
    
    const json = response.data;
    
    if (json && json.success && json.crypto) {
      console.log('Success! Number of crypto currencies:', Object.keys(json.crypto).length);
      res.json(json);
    } else {
      console.log('API returned error:', json);
      res.status(400).json({ message: "API error", error: json });
    }
  } catch (err) {
    console.log('Axios error:', err.message);
    if (err.code === 'ECONNABORTED') {
      console.log('Request timed out');
      res.status(504).json({ message: "Request timed out" });
    } else if (err.response) {
      console.log('Error response status:', err.response.status);
      console.log('Error response data:', err.response.data);
      res.status(err.response.status).json({ message: "API error", error: err.response.data });
    } else {
      res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
  }
});

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
        access_key: process.env.access_key,
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
app.get('/', (req, res) => {
  res.json({ 
    message: 'Crypto Haven API is running',
    endpoints: {
      list: '/list',
      live: '/live/:symbols?/:target?',
      convert: '/convert/:coinFrom/:coinTo/:fromQuantity',
      historical: '/historical/:date/:target/:symbols'
    }
  });
});

app.listen(port, () => {
  console.log(`listening on ${port}`)
})

