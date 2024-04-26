var express = require('express');
var router = express.Router();
var db = require('../db.js');

/* 게시판 목록페이지 */
router.get('/', function (req, res, next) {
    res.render('index', { title: '게시판', pageName: 'posts/list.ejs' });
});

//게시판 목록 데이터 불러오기
router.get('/list.json', function (req, res) {
    const page=req.query.page;
    const size=parseInt(req.query.size);
    const start=(page-1)*size ;
    const query="%"+ req.query.query+ "%"; //%는 sql의 와일드카드

    let sql = 'select *,date_format(pade, "%Y-%m-%d %T") fdate '
    sql+= ' from posts ';
    sql+= ' where title like ? or contents like ?';
    sql+= ' order by pid desc limit ?, ?';
    db.get().query(sql, [query, query, start, size], function (err, rows) {
        const documents = rows;
        sql="select count (*) total from posts where title like ? or contents like ?";
        db.get().query(sql, [query, query], function(err, rows){
            const total = rows[0].total;
            res.send({documents, total})
        
        });
    });
})

//글쓰기 페이지로 이동
router.get('/insert', function (req, res) {
    res.render('index', { title: '글쓰기', pageName: 'posts/insert.ejs' });
});


//글을 DB에 저장
router.post('/insert', function (req, res) {
    const title = req.body.title;
    const contents = req.body.contents;
    const uid = req.body.uid;
    console.log(title, contents, uid);
    const sql = "insert into posts (title, contents, writer) values(?,?,?)";
    db.get().query(sql, [title, contents, uid], function (err, rows) {
        if (err) {
            console.log('글쓰기 오류:', err);
        }
        res.redirect('/posts');
    })

});

//게시글 read 페이지이동
router.get('/read', function (req, res) {
    const pid = req.query.pid;
    console.log(pid);
    const sql = "select * , date_format(pade, '%Y-%m-%d %T') fdate from posts where pid=?";
    db.get().query(sql, [pid], function (err, rows) {
        res.render('index.ejs', { title: '게시글정보', pageName: 'posts/read.ejs', post: rows[0] });
    })


})


//게시글 삭제하는 작업
router.get('/delete', function (req, res) {
    const pid = req.query.pid;
    console.log("--------------", pid);
    const sql = "delete from posts where pid=?";
    db.get().query(sql, [pid], function (err, rows) {
        if (err) {
            console.log('삭제오류:', err);
        }
        res.redirect("/posts");
    })

})

//수정페이지 이동
router.get('/update', function (req, res) {
    const pid = req.query.pid;
    const sql = "select * from posts where pid=?";
    db.get().query(sql, [pid], function (err, rows) {
        if (err) {
            console.log('수정페이지', err)
        }
        const post = rows[0];
        res.render('index.ejs', {
            title: '게시글수정',
            pageName: 'posts/update.ejs',
            post: post
        });

    });
});

//데이터 수정
router.post('/update', function (req, res) {
    const pid = req.body.pid;
    const title = req.body.title;
    const contents = req.body.contents;
    console.log(pid, title, contents);
    const sql = "update posts set title=?, contents=?, pade=now() where pid=?";
    db.get().query(sql, [title, contents, pid], function (err, rows) {
        if(err){
            console.log("수정:", err);
        }
        res.redirect('/posts');
    })

})
module.exports = router;
