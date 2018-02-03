var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var app = express();

var port = process.env.PORT || 8080; 

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'mynode'
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Body解析器使用JSON数据

app.get('/', function(req, res) {
    res.json({message:"欢迎来到API接口"});
})
//获取商品列表
app.get('/goods', function(req,res) {
    var data = {
        "data": ""
    }
    conn.query("select * from goods", function(err, rows, fields){
        if(rows.length !=0) {
            data["data"] = rows;
            res.json(data);
        } else {
            data["data"] = "无数据...";
            res.json(data);
        }
    });
});

//查询商品I
//创建一个商品
app.post('/good', function(req, res) {
    var title = req.body.title;
    var price = req.body.price;
    conn.query("insert into goods (title, price) values(?,?)",[title,price],function(err, rows) {
        res.json({status: true});
    });
});

app.listen(3000, function () {
    console.log("✔ Express server listening on port " + port);
});

