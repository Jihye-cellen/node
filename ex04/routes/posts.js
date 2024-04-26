var express = require('express');
var router = express.Router();
var db = require('../db.js');

/* 게시판 목록페이지 */
router.get('/', function(req, res, next) {
  res.render('index', { title: '게시판', pageName:'posts/list.ejs' });
});

//게시판 목록 데이터 불러오기
router.get('/list.json', function(req, res){
    const sql = 'select * , date_format(pade, "%Y-%m-%d %T") fdate from posts order by pid desc';
    db.get().query(sql, function(err, rows){
        if(err){
            console.log('게시판목록:', err)
        }else{
            res.send(rows);
        }
    });
})

//글쓰기 페이지로 이동
router.get('/insert', function(req,res){
    res.render('index', {title:'글쓰기', pageName:'posts/insert.ejs'});
});


//글을 DB에 저장
router.post('/insert', function(req, res){
    const title = req.body.title;
    const contents =req.body.contents;
    const uid = req.body.uid;
    console.log(title, contents, uid);
    const sql ="insert into posts (title, contents, writer) values(?,?,?)";
    db.get().query(sql, [title, contents, uid], function(err, rows){
        if(err){
            console.log('글쓰기 오류:', err);
        }
        res.redirect('/posts');
    })
    
});

//게시글 read 페이지이동
router.get('/read', function(req, res){
    const pid=req.query.pid;
    console.log(pid);
    const sql= "select * , date_format(pade, '%Y-%m-%d %T') fdate from posts where pid=?";
    db.get().query(sql, [pid], function(err,rows){
        res.render('index.ejs', {
            title:'게시글정보', 
            pageName:'posts/read.ejs', 
            post:rows[0],
        });
    })
    

})




module.exports = router;
