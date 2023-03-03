var mysql = require("mysql");
var conn_info = {
    host : "localhost",
    port : 3306,
    user : "root",
    password : "root",
    database : "emons",
    multipleStatements : true
};

// 이름이 같은 상품 수량 합치기
function countPlus(db){
    var order = [];
    for(var i in db){
        var check = false;
        for(var j in order){
            if(db[i]["orderItemName"] == order[j]["orderItemName"]){ // 상품 일치
                order[j]["orderItemCount"] += db[i]["orderItemCount"]; // 수량 증가
                check = true // 중복 표시
                break;
            }
        }
        // 상품이 없으면
        if(!check){ // order에 추가
            order.push(db[i]);
        }
    }
    return order;
}

module.exports = function(app){
    
    // 장바구니 주문하기
    app.get("/orderCart", function(req, res){
        var log = req.session.log;
        
        var conn = mysql.createConnection(conn_info);
        var sql = " SELECT * FROM cartDB WHERE cartMemberId = ? ";
        var inputData = [log];
        var myCartDB;
        conn.query(sql, inputData, function(error, rows){
            myCartDB = rows; // 아이디가 일치하는 장바구니 정보
            
            // 주문 테이블에 추가
            // for(var i in myCartDB){
            //     var sql = " INSERT INTO orderDB VALUES(?, ?, ?, ?, ?, ?, ?) ";
            //     var inputData = [];
            //     for(var j in myCartDB[i]){
            //         inputData.push(myCartDB[i][j]);
            //     }
            //     conn.query(sql, inputData, function(error){});
            // }
            var sqls = "";
            var sql = " INSERT INTO orderDB VALUES(?,?,?,?,?,?,?);";
            for(var i in myCartDB){
                var inputData = [];
                for(var j in myCartDB[i]){
                    inputData.push(myCartDB[i][j]);
                }
                sqls += mysql.format(sql, inputData);
            }
            conn.query(sqls, function(error){});
            
            // 장바구니 테이블에서 삭제
            var sql = " DELETE FROM cartDB WHERE cartMemberId = ? ";
            var inputData = [log];
            conn.query(sql, inputData, function(error){
                conn.end();
                res.redirect("orderView");
            });   
        });
    });
    
    // 주문 정보 보기
    app.get("/orderView", function(req, res){
        
        var log = req.session.log;
        var name = req.session.name;
        
        var conn = mysql.createConnection(conn_info);
        var sql = " SELECT * FROM orderDB WHERE orderMemberId = ? ";
        var inputData = [log];
        conn.query(sql, inputData, function(error, rows){
            var order = rows;
            
            order = countPlus(order); // 이름이 같은 상품 수량 합치기
            
            conn.end();
            var renderData = {
                "log": log,
                "name": name,
                "order" : order
            };
            res.render("order/orderView.ejs", renderData);
        });
    });
    
    // 주문 정보 삭제
    app.get("/orderDelete", function(req, res){
        var log = req.session.log;
        var conn = mysql.createConnection(conn_info);
        var sql = " DELETE FROM orderDB WHERE orderMemberId = ? ";
        var inputData = [log];
        conn.query(sql, inputData, function(error){});
        conn.end();
        res.redirect("orderView");
    });
    
};