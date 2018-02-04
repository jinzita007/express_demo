var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var app = express();

var port = process.env.PORT || 8080; 

//连接mysql数据库
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

//获取商品列表分页
app.get('/good', function(req, res) {
    var param = req.query || req.params;
    var pageNum = parseInt(param.pageNum || 1);// 页码
    var end = parseInt(param.pageSize || 3); // 默认页数
    var start = (pageNum - 1) * end;
    var query = "select * from ?? limit ?,?";
    var table = ["goods", start, end];
    query = mysql.format(query, table);
    conn.query(query, function (err, rows, fields) {
        if (err)
        throw err;
        res.json(rows)
    });   
});

//查询商品ID
app.get('/good/:id',function(req, res) {
    var query = "select * from ?? where ?? = ?";
    var table = ["goods","id",req.params.id];
    query = mysql.format(query,table);
    conn.query(query, function(err, rows) {
        if(err) {
            res.json({ error: true, message: "执行MySQL查询时出错" });
        } else if(rows.length != 0){
            res.json({ error: false, message: "成功", "data": rows });
        } else {
            res.json({ error: false, message: "无数据...."});
        }
    })
});

//创建一个商品
app.post('/good', function(req, res) {
    var title = req.body.title;
    var price = req.body.price;
    var query = "insert into ??(??, ??) values(?,?)";
    var table = ["goods", "title", "price", title, price];
    query = mysql.format(query,table);
    conn.query(query,function(err, rows) {
        if (err) {
            res.json({ error: true, message: "执行MySQL查询时出错"});
        } else {
            res.json({ error: false, message: "成功创建商品" });
        }
    });
});

//更新一个商品
app.put('/good/:id', function (req, res) {
    var id = req.params.id;
    var title = req.body.title;
    var price = req.body.price;
    var query = "update ?? set ?? = ?,?? = ? where ?? = ?";
    var table = ["goods", "title", title, "price", price, "id", id];
    query = mysql.format(query, table);
    conn.query(query, function (err, rows) {
        if (err) {
            res.json({ error: true, message: "执行MySQL查询时出错" });
        } else {
            res.json({ error: false, message: "更新一个商品ID：" + id });
        }
    });
});

//删除一个商品
app.delete("/good/:id", function (req, res) {
    var id = req.params.id;
    var query = "delete from ?? where ?? = ?";
    var table = ["goods", "id", id];
    query = mysql.format(query, table);
    conn.query(query, function (err, rows) {
        if (err) {
            res.json({ error: true, message: "执行MySQL查询时出错" });
        } else {
            res.json({ error: false, message: "成功删除一个商品ID：" + id });
        }
    });
});

app.listen(8080, function () {
    console.log("✔ Express server listening on port " + port);
});

