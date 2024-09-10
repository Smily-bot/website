var express = require('express');
var router = express.Router();



router.post('/', function(req, res){
   res.send('POST route on things.');
});

router.get('/:name/:id([0-9]{5})', function(req, res){
    res.send('id: ' + req.params.id + ' name: ' + req.params.name);
});

router.get('/', function(req, res){
   if(req.session.page_views){
      req.session.page_views++;
      res.send("You visited this page " + req.session.page_views + " times");
   } else {
      req.session.page_views = 1;
      res.send("Welcome to this page for the first time!");
   }
});
//export this router to use in our index.js
module.exports = router;