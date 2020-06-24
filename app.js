//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs')
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
mongoose.connect('mongodb://localhost:27017/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const port = 3000;
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
//========================================== mongoose =========================================================
const userSchema = new mongoose.Schema({
username: String,
password: String
})
// Add any other plugins or middleware here. For example, middleware for hashing passwords



userSchema.plugin(encrypt, { secret:process.env.SECRET , encryptedFields: ['password'] });
// This adds _ct and _ac fields to the schema, as well as pre 'init' and pre 'save' middleware,
// and encrypt, decrypt, sign, and authenticate instance methods

const UserModel = new mongoose.model('user',userSchema);

//======================================== get requests ========================================================

//---------------------------------------- root ----------------------------------------------
app.get('/',function(req,res){
res.render('home')
})

//---------------------------------------- login ----------------------------------------------
app.get('/login',function(req,res){
res.render('login')
})

//----------------------------------------- register -----------------------------------------
app.get('/register',function(req,res){
res.render('register')
})


//====================================== post requests ==============================================================

//-------------------------------------- register page route --------------------------------------------------

app.post('/register',function(req,res){
  const username = req.body.username;
  const password = req.body.password;
  const newUser = new UserModel({
    username: username,
    password: password
  })
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render('secrets')      //the only way to the 'secrets' page is refister and login, no 'get' for it
    }
  });

})
//-------------------------------------- login page route --------------------------------------------------

app.post('/login',function(req,res){
  const username = req.body.username;
  const password = req.body.password;
  UserModel.findOne({username:username},function(err,results){
    if(!err){
      if(results){
        if( password === results.password ){
                  res.render('secrets')
        }
        else{
                   console.log('Invalid Password');
        }
      }
      else{
        console.log('No such username');
      }
    }
  })
})
//======================================= server listen ==============================================================
app.listen(port,function(){
  console.log('server currently running on port ' + port)
})
