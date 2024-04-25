var express = require('express');
var router = express.Router();
var db = require('../db'); //rountes 폴더 들어가기 전에 존재하기 때문에 ../db


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* 로그인 페이지로 이동. */
router.get('/login', function(req, res, next) {
  res.render('index', { title: '로그인', pageName:'users/login.ejs' });
});

/*로그인 체크*/
router.post('/login', function(req, res){
  const uid = req.body.uid;
  const upass=req.body.upass;
  console.log(uid, upass);
 
  const sql ="select* from users where uid=?";
  db.get().query(sql, [uid], function(err, rows){ //?는 uid 입력한 값으로 여러개를 입력할 수 있으니, 배열로 설정 row=행, rows라고 줘야함 
    if(err){
        console.log('에러:', err);
        return;
    }
    console.log(rows[0]); //rows를 그대로 출력시에는 배열로 출력
    let result =0;
    if(rows[0]){
        if(rows[0].upass==upass){
            result=1;
        }else{
            result=2;
        }
    }
    res.send({result}); //res = 응답, 프론트로(login.ejs의 data로 들어감) 출력, object로 출력
  });
 
});
module.exports = router;
