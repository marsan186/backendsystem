const express = require('express');
const cors = require('cors');
let morgan = require('morgan');
let config = require('config'); //we load the db location from the JSON files
var bodyParser = require('body-parser');
const { DB_URI } = require("./config");
// create express app
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Configuring the database
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true)
mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(DB_URI,{ 
  useNewUrlParser: true,
       }).then(() => {
  console.log("Successfully connected to the database");
}).catch(err => {
  console.log('Could not connect to the database. Exiting now...', err);
  process.exit();
});

// define a simple route
app.get('/', (req, res) => {
  res.json({ "message": "Welcome" });
});

require('./routes/userRoute.js')(app);
// listen for requests
app.listen(3004, () => {
  console.log("Server is listening on port 3004");
});

module.exports = app;

