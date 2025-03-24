const dotenv = require("dotenv")
dotenv.config({path:'.env'})
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
        if (!response.ok){
            throw new Error(`Response status: ${response.status}`)
        }
        const json = await response.json()
        console.log(json)
    }
    catch (err) {
        console.error(err.message)
    }

}
// await fetch(`${baseURL}${endpoint}?access_key=${process.env.ACCESS_KEY}&expand=1`)//
async function fetchList() {
    const endpoint = 'list'
    console.log(process.env.ACCESS_KEY)
    try {
        
        const response = await fetch(`${baseURL}${endpoint}?access_key=${process.env.ACCESS_KEY}`)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json()
        console.log(json)

    } catch (err) {
        console.error(err.message)
    }

}

async function fetchLiveData() {
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

//fetchLiveData()
fetchList()
//fetchHistory()
//fetchConvert()