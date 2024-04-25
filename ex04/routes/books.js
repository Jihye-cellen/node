var express = require('express');
var router = express.Router();

/* 도서 */
router.get('/', function(req, res, next) {
  res.render('index.ejs', { title: '도서검색', pageName:'book/search.ejs' });
});

module.exports = router;