require("dotenv").config();
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const flash = require('connect-flash');
const session = require("express-session");
const methodOverride = require('method-override');
const app = express();
const port = 5000 || process.env.PORT;
app.use(methodOverride('_method'));
const connectDB = require('./server/config/db')
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//express session
app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7 //1 week
        }
    })
);

app.use(flash({ sessionKeyName: 'flashMessage' }));

//connect db

connectDB();

//static folders
app.use(express.static('public'));
const path = require('path');

//templating engine
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');


//Routes

app.use('/', require("./server/routes/costumer"));

//Handle 404
app.get('*', (req, res) => {
    res.status(404).render('404');
})

app.listen(port, () => {
    console.log("Listning port")

})