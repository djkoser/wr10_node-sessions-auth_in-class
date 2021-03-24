require('dotenv').config();
const express = require('express');
const app = express();
const massive = require('massive'); 
const session = require('express-session'); 
const cors = require('cors');
const authCtrl = require('./Controllers/authCtrl');

const { PORT, CONNECTION_STRING, SESSION_SECRET } = process.env;

app.use(express.json());
app.use(session({
  resave:false, 
  saveUninitialized:true, 
  secret: SESSION_SECRET, 
  cookie: {maxAge:1000*60*60*24*7}
}));

app.use(cors()); 

//auth end points
app.post('autho/register', authCtrl.register);
app.post('auth/login', authCtrl.login); 
app.delete('/auth/logout', authCtrl.logout);


massive ({
  connectionString:CONNECTION_STRING,
  ssl:{rejectUnauthorized:0}
})
.then(dbInstance => {
  app.set('db', dbInstance);
  app.listen(PORT, ()=> console.log(`DB and Server Connected on Port ${PORT}.`)); 
})
.catch (err=> console.log(err));






