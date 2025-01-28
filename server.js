
const express = require("express")
const app = express()
const dotenv = require("dotenv")
dotenv.config()
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const morgan = require("morgan")

const port = process.env.PORT ? process.env.PORT : "3000";
mongoose.connect(process.env.MONGODB_URI) //imports mongoose library into node.js app


// authctrl here later
// Require the router objects (we call them Controllers, Ctrl for short)
// Mount them at the end of the middleware chain
const authCtrl = require('./controllers/auth')

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan('dev'));
// session for cookie authentication
/*
app.use(session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: true,
}))
*/

// The mounting of your controllers is ALWAYS at the end of the middleware chaiin,
// because our routers handle the responses to the client,
// and our middleware just does things to the request before the endpoint is reached
// mount our router objects onto the server
app.use('/auth', authCtrl)


app.get('/', (req, res) => {
    res.render('welcome.ejs')
})



app.listen(port, () => {
    console.log(`connected to mongoose on port ${port} lol!`)
})