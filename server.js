
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
mongoose.connect(process.env.MONGODB_URI) //imports mongoose library into node.js app

mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
  });

// authctrl here later
// Require the router objects (we call them Controllers, Ctrl for short)
// Mount them at the end of the middleware chain
const authCtrl = require('./controllers/auth')
//const portCtrl = require('./controllers/port')
const coinCtrl = require('./controllers/coin')
// server.js

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
// app.use(morgan('dev'));

// new code below this line ---
app.use(express.static(path.join(__dirname, 'public')));
// new code above this line ---

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
// server.js



// new code below this line ---


// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan('dev'));
// session for cookie authentication

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    //cookie: { secure: true }
}))


// The mounting of your controllers is ALWAYS at the end of the middleware chaiin,
// because our routers handle the responses to the client,
// and our middleware just does things to the request before the endpoint is reached
// mount our router objects onto the server
app.use('/auth', authCtrl)
app.use('/coin', coinCtrl)



app.get('/', function(req, res) {
    console.log(req.session, " <<<<<req session");
    res.render('welcome.ejs', { user: req.session.user });
});


app.listen(port, () => {
    console.log(`connected to mongoose on port ${port} lol! `)
})
