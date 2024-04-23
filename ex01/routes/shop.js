var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '상품검색', pageName:'shop.ejs' });
});

module.exports = router;