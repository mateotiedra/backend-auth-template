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

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// database
const db = require('./app/models/db.model');

// true to set the database for the first time or reset it
const resetDB = true;
db.sequelize.sync({ force: resetDB }).then(() => {
  if (!resetDB) {
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
/* require("./app/routes/user.routes")(app);
require("./app/routes/bid.routes")(app); */

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {}
