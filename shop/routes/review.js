var express = require('express');
var router = express.Router();
var db = require("../db");

/* 리뷰. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/insert', function(req, res){
    const uid = req.body.uid;
    const bid = req.body.bid;
    const contents= req.body.contents;
    const sql = "insert into review (uid, bid, contents) values (?,?,?) ";
    db.get().query(sql, [uid, bid, contents], function(err, rows){
        if(err){
            res.send({result:0});
        }else{
            res.send({result:1});
        }
    });
});

router.get('/list/:bid', function(req,res){
    const bid = req.params.bid;
    const page = parseInt(req.query.page);
    const size= parseInt(req.query.size);
    let sql = "select * from view_review where bid=? order by rid desc limit ?,? ";
    db.get().query(sql, [bid, (page-1)*size, size], function(err, rows){
        console.log(err);
        const documents=rows;
        sql = "select count(*) count from review where bid=?";
        db.get().query(sql, [bid], function(err, rows){
            res.send({documents, count: rows[0].count});
        });
    });
});


router.post('/delete/:rid', function(req,res){
    const rid =req.params.rid;
    const sql = "delete from review where rid=?";
    db.get().query (sql, [rid], function(err, rows){
        if(err){
            res.send({result:0});
        }else{
            res.send({result:1});
        }
    });
});

router.post('/update', function(req, res){
    const rid=req.body.rid;
    const contents=req.body.contents;
    const sql="update review set contents=? where rid=?";
    db.get().query(sql, [contents, rid], function(err, rows){
      if(err){
        res.send({result:0});
      }else{
        res.send({result:1});
      }
    });
  });

module.exports = router;