var express = require('express');
var router = express.Router();
var Users = [];
router.post('/message/', function(req, res){
   console.log(req.body);
   res.send("recieved your request!");
});

router.post('/signup', function(req, res){
   if(!req.body.id || !req.body.password){
      res.status("400");
      res.send("Invalid details!");
   } else {
      Users.filter(function(user){
         if(user.id === req.body.id){
            res.redirect('/signup_bad');
         }else{
            var newUser = {id: req.body.id, password: req.body.password};
            Users.push(newUser);
            req.session.user = newUser;
            console.log(Users);
            res.redirect('/protected_page');
         }
      });
      var newUser = {id: req.body.id, password: req.body.password};
      Users.push(newUser);
      req.session.user = newUser;
      console.log(Users);
      res.redirect('/protected_page');
   }
});

router.post('/login', function(req, res){
   console.log(Users);
   if(!req.body.id || !req.body.password){
      res.render('login', {message: "Please enter both id and password"});
   } else {
      Users.filter(function(user){
         if(user.id === req.body.id && user.password === req.body.password){
            req.session.user = user;
            res.redirect('/protected_page');
         }
      });
      res.render('login', {message: "Invalid credentials!"});
   }
});

//export this router to use in our index.js
module.exports = router;