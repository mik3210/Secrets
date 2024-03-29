//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");




const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));





//************************mongoose******************************/
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/userDB", {
    useNewUrlParser: true
  });
}

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});



userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ['password']
});

const User = new mongoose.model('User', userSchema);


//**********************get request***********************/
app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});


//*******************post request **********************/
app.post("/register", function(req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save().then(() => {
    res.render('secrets')
  }).catch((err) => console.log(err));



});


app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  console.log("username: " + username);
  console.log("password: " + password);

  User.findOne({
    email: username
  }).then(function(foundUser) {
    if (foundUser === null) {
      res.render("home");
    } else {
      if (foundUser.password === password) {
        res.render('secrets');
      } else {
        res.render("home");
      }
    }

  }).catch(function(err) {
    console.log(err);
  });






});








/********************listen request************************/
app.listen(3000, function() {
  console.log("Server started on port 3000")
});
