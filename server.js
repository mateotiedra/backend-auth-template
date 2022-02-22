require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

/*const cors = require('cors');
var corsOptions = {
  origin: process.env.APP_ORIGIN,
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions)); */

// Use helmet for security
const helmet = require('helmet');
app.use(helmet());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(express.json());

// Database
const db = require('./app/models/db.model');

// True to set the database for the first time or reset it
const resetDB = false;
db.sequelize.sync({ force: resetDB }).then(() => {
  if (resetDB) {
    console.log('Drop and Resync Database with { force: true }');
    initial();
  }
});

// simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the api.' });
});

// routes
require('./app/routes/auth.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {}
