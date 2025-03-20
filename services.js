const baseURL = 'http://api.coinlayer.com/api/'
const dotenv = require("dotenv")
dotenv.config()

async function fetchHistory() {

    //const endpoint = prompt("Can you provide the date in YYYY-MM-DD format?")
    const endpoint = '2018-04-01?'
    try {
        const response = await fetch(`${baseURL}${endpoint}access_key=${process.env.ACCESS_KEY}&expand=1`)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json()
        console.log(json)

    } catch (err) {
        console.err(err.message)
    }
}

async function fetchList() {
    const endpoint = 'list?'
    try {
        const response = await fetch(`${baseURL}${endpoint}access_key=${process.env.ACCESS_KEY}& expand = 1`)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json()
        console.log(json)

    } catch (err) {
        console.err(err.message)
    }

}

async function fetchLiveData() {
    const endpoint = 'live?' //added '?'
    //const symbol = input("What Cryptocurrency would you like (for now write 'btc'")
    try {
        const response = await fetch(`${baseURL}${endpoint}access_key=${process.env.ACCESS_KEY}& expand = 1`)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json()
        console.log(json)

    } catch (err) {
        console.err(err.message)
    }

}

//fetchLiveData()
//fetchList()
fetchHistory()