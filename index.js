const express=require('express');
const app = express();


const bodyParser = require('body-parser');
const mongoconnect = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const nodemailer = require('nodemailer');

const port = process.env.PORT || 3000;

var allowlist = ['https://h2h-angular-admin.herokuapp.com', 'https://h2h-angular.herokuapp.com', 'http://localhost:4201', 'http://localhost:4200']
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

//Package middleware
app.use(cors(corsOptionsDelegate));
// app.use(bodyParser.json({limit: '50mb'}));
// app.use(bodyParser.urlencoded());
// app.use(bodyParser.json());
app.use(express.urlencoded({limit: '50mb',
parameterLimit: 100000,
extended: true}))
app.use(express.json({limit: '50mb'}))
//Db connection
mongoconnect.connect(process.env.DB_CONNECT)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the process with an error code
  });


//Routes imports
const registerRoute = require('./Routes/Auth/registration');
const loginRoute = require('./Routes/Auth/login');
const passwordRoute = require('./Routes/Auth/password');

//Route middleware
app.use('/auth',registerRoute)
app.use('/login',loginRoute)
app.use('/password',passwordRoute)

//These is used to allow access to the images folder
app.use('/public',express.static('public'));  
app.use('/images', express.static('images')); 

//Server poor
app.listen(port,()=>{
    console.log('Port running at 3000');
})