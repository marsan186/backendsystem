const express = require('express');
const inspector = require('inspector');
const cors = require('cors');

var VendorRouter = require('./routes/vendorRoute');
const { DB_URI } = require("./config");

let morgan = require('morgan');
let config = require('config'); //we load the db location from the JSON files
var bodyParser = require('body-parser');

//db options
let options = { 
  useNewUrlParser: true,
       }; 

// create express app
const app = express();
const multer = require('multer');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/vendor', VendorRouter);
// Configuring the database

const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true)
mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(DB_URI,options).then(() => {
  console.log("Successfully connected to the database");
}).catch(err => {
  console.log('Could not connect to the database. Exiting now...', err);
  process.exit();
});


// define a simple route
app.get('/', (req, res) => {
  res.json({ "message": "Welcome" });
});

// listen for requests
app.listen(3006, () => {
  console.log("Server is listening on port 3006");
});

module.exports = app;

