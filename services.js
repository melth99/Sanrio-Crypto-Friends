const { randomBytes } = require("crypto")
const dotenv = require("dotenv")
const { captureRejectionSymbol } = require("events")
dotenv.config({ path: '.env' })
const baseURL = 'http://api.coinlayer.com/'

// https://coinlayer.com/documentation

async function fetchHistory() {

    //const endpoint = prompt("Can you provide the date in YYYY-MM-DD format?")cd ..
    const endpoint = '2018-04-01'
    try {
        const response = await fetch(`${baseURL}${endpoint}?access_key=${process.env.ACCESS_KEY}&expand=1`)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json()
        console.log(json)

    } catch (err) {
        console.error(err.message)
    }
}

async function fetchConvert() {
    const fromThisCoin = 'BTC'
    const toThisCoin = 'ETH'
    const endpoint = 'convert'
    const from = fromThisCoin
    const to = toThisCoin
    const date = null
    const amount = 100 // 100$

    try {

        const response = await fetch(`${baseURL}${endpoint}?access_key=${process.env.ACCESS_KEY}&from=${from}&to=${to}&amount=${amount}`)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }
        const json = await response.json()
        console.log(json.rates)
    }
    catch (err) {
        console.error(err.message)
    }

}
// await fetch(`${baseURL}${endpoint}?access_key=${process.env.ACCESS_KEY}&expand=1`)//
async function fetchList(coinSymbol = null) { //default value null
    const endpoint = 'list'

    try {

        const response = await fetch(`${baseURL}${endpoint}?access_key=${process.env.ACCESS_KEY}&extend=1`)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json()
        //console.log(json) //prints all currency data as wll as each cryptocurrency
        //console.log(json.fiat)//prints currency fiat refers to value in traditional currency
        //console.log(json.fiat.NAD) // returns full name of currency using short hand as a key in json
        //console.log(json.crypto[coinSymbol]) // different for fetch live.

        if (coinSymbol) { // specific coin
            console.log(json.crypto[coinSymbol])
        }
        else {  
            console.log(json.crypto)
        }
    } catch (err) {
        console.error(err)
    }
}



async function fetchLiveData() {
    //extended results includes
    /*    timestamp -exact utc timestamp
        default target for specified currency
        exchange rate
        high/low ER- highest/lowest midpoint exchange rate on that day 
        volume - volume of cryptocurrency exchanged on requested date
        market cap - total value of crypto currency
    
        */
    const endpoint = 'live' //added '?'
    //const symbol = input("What Cryptocurrency would you like (for now write 'btc'")
    try {
        const response = await fetch(`${baseURL}${endpoint}?access_key=${process.env.ACCESS_KEY}& expand = 1`)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json()
        console.log(json)

    } catch (err) {
        console.error(err.message)
    }

}

//fetchLiveDa()
//fetchHistory()
//fetchConvert()
const coinSymbol = 'ZSC'
fetchList(coinSymbol)
