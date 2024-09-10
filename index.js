//Creating server is also a part of core module i.e., http Module
const url = require("url");
const express = require('express');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const session = require('express-session');

var upload = multer();
var app = express();

const hostname = "localhost";
const port = "3000";

app.use(cors({origin: 'http://localhost:3000/'}))

app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!"}));
//To parse URL encoded data
app.use(bodyParser.urlencoded({ extended: false }));
//To parse json data
app.use(bodyParser.json());

app.use(upload.array());

app.set('view engine', 'pug');
app.set('views','./public/pugviews');

var things = require('./things.js');
var api = require('./api.js');

/*
 app.get('/signup', function(req, res){
    res.send("<!DOCTYPE html>\n<html>\n<head>\n<title>Signup</title>\n</head>\n<body>\n<h4>User Already Exists! Login or choose another user id</h4>\n<form action=\"http://localhost:3000/api/signup\" method=\"POST\">\n<input name=\"id\" type=\"text\" required=\"required\" placeholder=\"User ID\"/>\n<input name=\"password\" type=\"password\" required=\"required\" placeholder=\"Password\"/>\n<button type=\"Submit\">Sign me up!</button>\n</form>\n</body>\n</html>");
 });
*/

app.get('/goof', function(req, res, next){
   //Create an error and pass it to the next function
   var err = new Error("Something went wrong");
   next(err);
});

function checkSignIn(req, res, next){
    if(req.session.user){
       next();     //If session exists, proceed to page
    } else {
       var err = new Error("Not logged in!");
       console.log(req.session.user);
       next(err);  //Error, trying to access unauthorized page!
    }
 }
 app.get('/protected_page', checkSignIn, function(req, res){
    res.render('protected_page', {id: req.session.user.id})
 });
 
 app.get('/login', function(req, res){
    res.render('login');
 });
 
 app.get('/logout', function(req, res){
    req.session.destroy(function(){
       console.log("user logged out.")
    });
    res.redirect('/login');
 });
 
 app.use('/protected_page', function(err, req, res, next){
 console.log(err);
    //User should be authenticated! Redirect him to log in.
    res.redirect('/login');
 });


app.use('/things', things);
app.use('/api', api);
app.get('/first_template', function(req, res){
    res.render('testview',{});
 });

app.use(express.static('public'));

//An error handling middleware
app.use(function(err, req, res, next) {
   res.status(500);
   res.send("Oops, something went wrong.")
   console.log(err)
   next()
});

app.get('*', function(req, res){
    res.send('Sorry, this is an invalid URL.');
});

app.listen(port);

console.log(`Server Running at http://${hostname}:${port}`);
