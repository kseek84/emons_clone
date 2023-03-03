// mysql 아래 명령어를 db상에서 반드시 실행해야한다.  
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
var mysql = require("mysql");
var conn_info = {
	host : "localhost",
	port : 3306,
	user : "root",
	password : "root",
	database : "emons",
    multipleStatements: true    // 여러 쿼리를 ;를 기준으로 한번에 보낼 수 있게 해줌.
};

// db에서 c 카테고리만 모아서 새 db 만들어서 리턴
function getCategoryDB(db, c){
    var newDB = [];
    for(var i in db){
        if(db[i]["itemCategory"] == c){
            newDB.push(db[i]);
        }
    }
    return newDB;
}

// itemNo 가 일치하는 상품 정보 가져오기
function getItem(itemDB, itemNo){
    for(var i in itemDB){
        if(itemDB[i]["itemNo"] == Number(itemNo)){
            return itemDB[i];
        }
    }
}

// (검색어) k 가 이름에 포함된 상품만 모아서 리턴
function getSearchDB(db, k){
    var newDB = [];
    for(var i in db){
        var n = db[i]["itemName"]; // 아이템 이름
        if(n.indexOf(k) != -1){
            newDB.push(db[i]);
        }
    }
    return newDB;
}

module.exports = function(app){

    // 상품 리스트 보기
    app.get("/itemList", function(req, res){

        var conn = mysql.createConnection(conn_info);
        var sql = " SELECT * FROM itemDB ";
        conn.query(sql, function(error, rows){
            var itemDB = rows;
            conn.end();
            
            var category = req.query.category;
            var itemCategoryDB;
            if(typeof category == "undefined"){
                category = "전체";
            }
            if(category == "전체"){
                itemCategoryDB = itemDB;
            }
            else {
                itemCategoryDB = getCategoryDB(itemDB, category);    
            }
            
            var search = req.query.search;
            if(typeof search != "undefined" && search != null && search != ""){
                itemCategoryDB = getSearchDB(itemCategoryDB, search);
            }
            
            var log = req.session.log;
            var name = req.session.name;
            
            var renderData = {
                "log" : log,
                "name" : name,
                "category" : category,
                "itemDB" : itemCategoryDB
            };
            res.render("item/itemList.ejs", renderData);
            });
        
    });
    
    // 상품 페이지
    app.get("/itemView", function(req, res){
        var itemNo = req.query.itemNo;
        var log = req.session.log;
        var name = req.session.name;
        
        var conn = mysql.createConnection(conn_info);
        var sql = " SELECT * FROM itemDB ";
        conn.query(sql, function(error, rows){
            var itemDB = rows;
            var item = getItem(itemDB, itemNo);
            var renderData = {
                "log" : log,
                "name" : name,
                "item" : item
            };
            res.render("item/itemView.ejs", renderData);
        });        
    });
};