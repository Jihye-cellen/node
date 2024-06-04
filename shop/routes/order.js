var express = require('express');
var router = express.Router();
var db = require('../db')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//사용자구매정보 등록
router.post('/purchase', function(req, res){
    const pid = req.body.pid;
    const uid = req.body.uid;
    const uname= req.body.uname;
    const phone= req.body.phone;
    const address1=req.body.address1;
    const address2=req.body.address2;
    const sum=req.body.sum;
    const sql = "insert into purchase (pid, uid, uname, phone, address1, address2, sum) values (?,?,?,?,?,?,?)"
    db.get().query(sql, [pid, uid, uname, phone, address1, address2, sum], function(err, rows){
        if(err){
            res.send({result:0});
        }else{
            res.send({result:1});
        }
    });
});

//주문상품입력
router.post('/insert', function(req, res){
    const pid=req.body.pid;
    const bid=req.body.bid;
    const price=parseInt(req.body.price);
    const qnt=parseInt(req.body.qnt);
    const sql= "insert into orders (pid, bid, price, qnt) values (?,?,?,?)";
    db.get().query(sql, [pid, bid, price, qnt], function(err, rows){
        if(err){
            res.send({result:0});
        }else{
            res.send({result:1});
        }
    })
})


//사용자별 주문목록
router.get('/list', function(req,res){
    const uid = req.query.uid;
    let sql = " select *,  date_format(pdate, '%Y-%m-%d %T') as fmtdate, format(sum, 0) as fmtsum";
        sql += " from purchase where uid =? order by pdate desc";
    db.get().query(sql, [uid], function(err,rows){
        res.send(rows);
    });        
});


//모달창의 주문목록
router.get('/books', function(req,res){
    const pid = req.query.pid;
    let sql = " select o.* , b.title, b.image, format(o.price, 0) fmtprice, format(o.price*o.qnt,0) fmtsum";
        sql +=" from orders o, books b where o.bid = b.bid and pid =?";
    db.get().query(sql, [pid], function(err, rows){
        res.send(rows);
    })
})

//관리자 주문목록
router.get('/admin/list', function(req, res){
    const key = req.query.key;
    const word = req.query.word;
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.size);
    let sql= " select * ,  date_format(pdate, '%Y-%m-%d %T') as fmtdate, format(sum, 0) as fmtsum";
        sql+=` from purchase where ${key} like ?`
        sql+=" order by pdate desc limit ?, ?"
    db.get().query(sql, [`%${word}%`,(page-1)*size, size], function(err,rows){
       let documents = rows;
        sql = " select count(*) count from purchase ";
        sql += ` where ${key} like ? ` ;
        db.get().query(sql, [`%${word}%`], function(err, rows){
            console.log(err);
            const count = rows[0].count;
            if(count==0){
                res.send({documents:[], count})
            }else{
                res.send({documents, count})
            }
        })
        
    });
});


//주문상태변경
router.post('/status', function(req,res){
    const pid = req.body.pid;
    const status = req.body.status;
    const sql = "update purchase set status=? where pid=?"
    db.get().query(sql, [status, pid], function(err, rows){
        if(err){
            console.log('err......', err);
            res.send({result:0});
        }else{
            res.send({result:1});
        }
    });
});

module.exports = router;