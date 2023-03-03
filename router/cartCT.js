// // mysql 아래 명령어를 db상에서 반드시 실행해야한다.  
// // ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
var mysql = require("mysql");
var conn_info = {
	host : "localhost",
	port : 3306,
	user : "root",
	password : "root",
	database : "emons",
    multipleStatements: true    // 여러 쿼리를 ;를 기준으로 한번에 보낼 수 있게 해줌.
};

// cartDB의 cartNo 최대값 리턴
function getMaxCartNo(cartDB){
    var max = 0;
    for(var i in cartDB){
        if(cartDB[i]["cartNo"] > max){
            max = cartDB[i]["cartNo"];
        }
    }
    return max;
}

// itemDB에서 itemNO가 일치하는 item 리턴
function getItem(itemDB, itemNo){
    for(var i in itemDB){
        if(itemDB[i]["itemNo"] == itemNo){
            return itemDB[i];
        }
    }
}

// 아이디가 일치하는 장바구니 정보 모으기
function getCart(cartDB, log){
    var cart = [];
    for(var i in cartDB){
        if(cartDB[i]["cartMemberId"] != log){ continue; } // 아이디 불일치시 건너뛰기
        var check = false;
        for(var j in cart){
            if(cart[j]["cartItemName"] == cartDB[i]["cartItemName"]){ // 상품이 이미 있으면
                cart[j]["cartItemCount"] += cartDB[i]["cartItemCount"]; // 수량 증가
                check = true; // 중복 표시
                break;
            }
        }
        // 상품이 없으면
        if(!check){ // db 에 추가
            cart.push(cartDB[i]);
        }
    }
    return cart;
}

module.exports = function(app){
    
    // 장바구니에 상품 추가
    app.get("/cartAdd", function(req, res){
        
        var itemNo = req.query.itemNo;
        var itemCount = req.query.itemCount;
        var log = req.session.log;
        
        var itemDB;
        var cartDB;
        
        var conn = mysql.createConnection(conn_info);
        var sql = " SELECT * FROM itemDB ";
        conn.query(sql, function(error, rows){
            itemDB = rows;
            var sql = " SELECT * FROM cartDB ";
            conn.query(sql, function(error, rows){
                cartDB = rows;
                var cartNo = getMaxCartNo(cartDB);
                cartNo += 1;
                var item = getItem(itemDB, itemNo);
                var cartItem = {
                    "cartNo" : cartNo,
                    "cartItemNo" : Number(itemNo),
                    "cartMemberId" : log, 
                    "cartItemName" : item["itemName"],
                    "cartItemCount" : Number(itemCount), 
                    "cartItemImage" : item["itemImg"], 
                    "cartItemPrice" : item["itemPrice"]
                };
                var sql = " INSERT INTO cartDB VALUES(?,?,?,?,?,?,?)";
                var inputData = [];
                for(var i in cartItem){
                    inputData.push(cartItem[i]);
                }
                conn.query(sql, inputData, function(error){
                    conn.end();
                    res.redirect("cartView");    
                });
            });
        });
    });
    
    // 장바구니 보기
    app.get("/cartView", function(req, res){
        var ss = req.session;
        
        var log = ss.log;
        var name = ss.name;
        
        var conn = mysql.createConnection(conn_info);
        var sql = " SELECT * FROM cartDB ";
        conn.query(sql, function(error, rows){
            var cartDB = rows;
            conn.end();
            var cart = getCart(cartDB, log);

            var renderData = {
                "log" : log,
                "name" : name,
                "cart" : cart
            };
            res.render("cart/cartView.ejs", renderData);

        });
    });
    
    // 장바구니 상품 삭제
    app.get("/cartDelete", function(req, res){
        var cartItemNo = req.query.cartItemNo;
        var conn = mysql.createConnection(conn_info);
        var sql = " DELETE FROM cartDB WHERE cartItemNo = ? ";
        var inputData = [cartItemNo];
        conn.query(sql, inputData, function(error){
            conn.end();
            res.redirect("cartView");
        });
        
    });
};