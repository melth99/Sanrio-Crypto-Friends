
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


app.use('/auth', authCtrl)
app.use('/coin', coinCtrl)


app.get('/', function (req, res) {

  res.render('welcome.ejs', { user: req.session.user });
});


app.listen(port, () => {

})
