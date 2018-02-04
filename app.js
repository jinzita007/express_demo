var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var Promise = require("bluebird");
var app = express();

var port = process.env.PORT || 8080; 

//连接mysql数据库
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'mynode'
});

const queryAsync = Promise.promisify(connection.query.bind(connection));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Body解析器使用JSON数据

app.get('/', (req, res) => {
    res.json({ message: "欢迎来到API接口" });
});
//获取商品列表
app.get('/goods', (req, res) => {
    var data = {
        "data": ""
    }
    queryAsync("select * from goods", (err, rows, fields) => {
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
app.get('/good', (req, res) => {
    var total;
    var pageNum = parseInt(req.query.pageNum,10) || 1; // 页码
    var page = parseInt(req.query.page,10) || 0; // 默认页数
    var numPages;
    var skip = page * pageNum;

    console.log(req.query);
    console.log(page);
    console.log(pageNum);
    console.log(skip);

    var end = pageNum;
    var limit = skip + ',' + end;

    console.log(limit);
    console.log("SELECT * FROM goods DESC LIMIT " + limit);
    queryAsync("select count(*) as total from goods")
    .then(results => {
        total = results[0].total;
        numPages = Math.ceil(total / page);
        console.log('number of pages:', numPages);
    })
        .then(() => queryAsync("SELECT * FROM goods LIMIT " + limit))
        .then(results => {
            var responsePayload = {
                results: results
            };
            res.json(responsePayload);
        })
        .catch(err => {
            console.error(err);
            res.json({ err: err });
        });
   
});

//查询商品ID
app.get('/good/:id',function(req, res) {
    var query = "select * from ?? where ?? = ?";
    var table = ["goods","id",req.params.id];
    query = mysql.format(query,table);
    queryAsync(query, function(err, rows) {
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
    queryAsync(query,function(err, rows) {
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
    queryAsync(query, function (err, rows) {
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
    queryAsync(query, function (err, rows) {
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

