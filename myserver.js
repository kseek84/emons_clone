// 서버
var express = require("express");
var app = express();
var port = 80;
var server = app.listen(port, function(){
    console.log("서버 On - localhost:" + port);
});

// ejs
var ejs = require("ejs");
app.set("views", "./views");
app.set("view engine", "ejs");
app.engine("ejs", ejs.renderFile);

// 이미지 폴더
app.use(express.static("./img"));

// 세션
var session = require("express-session");
app.use(session({
    secret : "abc",
    resave : false,
    saveUninitialized : false
}));

// 라우터 연결
require("./router/cartCT")(app); // 장바구니
require("./router/itemCT")(app); // 상품 페이지
require("./router/memberCT")(app); // 회원 관리
require("./router/orderCT")(app); // 주문 관리
require("./router/reviewCT")(app); // 리뷰 게시판

// db 연결
var mysql = require("mysql");
var conn_info = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "emons",
    multipleStatements: true
};

// 라우터 메인
app.get("/", function(req, res){
    res.redirect("main");
});

app.get("/main", function(req, res){
    res.redirect("itemList?category=전체");
});