const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const {mongo} = require("mongoose");
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const URL = process.env.URL;

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true // if you're using cookies or Authorization headers
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//================
const UserRoute = require('./route/userRoutes');
//============

app.use('/api/v1/user', UserRoute);


mongoose.connect(URL).then(()=>{
    console.log('MongoDB Connected!...');
}).catch(err=>{
    console.error((err));
});


app.listen(PORT,() => {
    console.log(`Server started on port: ${PORT}`);
});


module.exports = app;