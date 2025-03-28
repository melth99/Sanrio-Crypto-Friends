
const dotenv = require("dotenv")
const axios = require('axios')
const express = require('express')
const app = express();
app.use(express.json()); //middleware nessesary to parse incoming json data. Parsed json data is now available in req.body

//onst { captureRejectionSymbol } = require("events")
dotenv.config({ path: '.env' })
const endpoint = ''
const baseURL = 'http://api.coinlayer.com/'



// https://coinlayer.com/documentation
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
        console.log('API Response:', json);

        if (json.success) {
            const result = {
                from: coinFrom,
                to: coinTo,
                amount: fromQuantity,
                result: json.result,
                rate: json.info.rate
            };
            console.log('Conversion result:', result);
            res.json(result);
        } else {
            console.log("API request failed:", json.error);
            res.status(400).json({ error: json.error.info });
        }
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({ error: 'An internal server error occurred' });
    }
});

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
    try {
        const response = await axios.get(`${baseURL}live`, {
            params: {
                access_key: process.env.ACCESS_KEY,
                symbols: symbols,
                target: target,
                expand: 1
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
    const date = req.params.date;
    const target = req.params.target || 'USD';
    const symbols = req.params.symbols || '';
  
    try {
      const response = await axios.get(`${baseURL}historical/${date}`, {
        params: {
          access_key: process.env.ACCESS_KEY,
          target: target,
          symbols: symbols,
          expand: 1,
        }
      });
      console.log(response)

      const json = response.data;
      console.log(json)
  
      if (json.success) {
        const result = {
          
        };
  
        console.log(json);
        console.log(result);
  
        res.json(result);
      } else {
        console.log("Failed to fetch historical data:", json);
        res.status(404).json({ message: "Historical data not available" });
      }
    } catch (err) {
      console.error('Error fetching historical data:', err.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  




/* Definitions
 rate: This is the average exchange rate of XTZ on the specified date. In this case, it's 2.68217.

high: The highest exchange rate recorded for XTZ on that date, which is 2.9392.
 
low: The lowest exchange rate recorded for XTZ on that date, which is 2.58659.
 
vol: The trading volume of XTZ on that date, which is 535313.10018. This represents the total amount of XTZ traded.
 
cap:. In this case, it's listed as 0, which might be an error or indicate that this data was not available.
 
sup: The total supply of XTZ on that date. Again, it's listed as 0, which could be due to missing data.
++++++++++++cryptocurrency data, change and change_pct are often calculated relative to the previous day's closing price.+++++++
change: The absolute change in XTZ's exchange rate from the previous day or period. Here, it's -0.22506000000000004.
 
change_pct: The percentage change in XTZ's exchange rate from the previous day or period. In this case, it's -7.74138957014065%. */
//const endpoint = prompt("Can you provide the date in YYYY-MM-DD format?")cd ..
/* 

   




//const endpoint = 'live' //added '?'
//const symbol = input("What Cryptocurrency would you like (for now write 'btc'")
/*     try {
        const response = await fetch(`${baseURL}${endpoint}?access_key=${process.env.ACCESS_KEY}& expand = 1`)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json()
        console.log(json)

    } catch (err) {
        console.error(err.message)
    }

} */

app.listen(3001, () => {
    console.log('Server listening on port 3001');
});

//fetchLiveDa()
//fetchHistory(coinSymbol = '')
//fetchConvert()
/* const coinSymbol = 'ZSC'*/
//fetchList(coinSymbol = null)
