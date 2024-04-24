//mysql 연결
var mysql = require('mysql');
var config={
    connectionLimit:100,
    host:'localhost',
    user:'node',
    password:'pass',
    database: 'nodedb',
    port:'3306' //sql의 port
}

//connection pool
//exports=외부에서 사용하기 위해 쓰는 함수
var pool = mysql.createPool(config);
var connection;
exports.connect = function(){
    pool.getConnection(function(err, con){
        if(err){
            console.log('db접속오류:', err)
        }else{
            connection=con;
            console.log('db접속성공');
        }
    })
}
//쿼리문을 실행할때마다 실행
exports.get = function(){
    return connection;
}