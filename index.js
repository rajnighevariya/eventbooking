const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require('path')
const cors = require("cors");
const errorhandler = require('./middleware/errorCatchHandler');
require("dotenv").config();
const app = express();
//static
app.use('/upload', express.static('upload'));
//roures
const userRoures = require('./routes/userRoutes');
const stripeRoures = require('./routes/stripeRoutes');

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'client')));



app.get('/', (req, res, next) => {
    res.send('Welcome to event Ticket Booking!')
})
app.use('/api/v1/user', userRoures)
app.use('/api/v1/stripe', stripeRoures)
// Middleware for Errors
app.use(errorhandler)

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});
let mongourl = `mongodb+srv://rajni:${process.env.MONGO_DBPASS}@admin.oxpgsgn.mongodb.net/eventTicket?retryWrites=true&w=majority`;
// `mongodb+srv://admin:${process.env.MONGODB_PASSWORORD}@cluster0.hes3x.mongodb.net/eventTicket?retryWrites=true&w=majority`
mongoose
    .connect(mongourl)
    .then(() => {
        app.listen(5000);
        console.log("Database is connected! Listening to localhost 5000");
    })
    .catch((err) => console.log(err));