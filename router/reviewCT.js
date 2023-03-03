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

// db를 key를 기준으로 오름차순 정렬
function sortKey(db, k){
    db.sort(function(x, y){return x[k] > y[k] ? 1 : -1});
}

// db1의 k1 값과 db2의 k2 값이 같으면 db2의 k3값을 db1에 추가
function plusDB(db1, db2, k1, k2, k3){
    for(var i1 in db1){
        for(var i2 in db2){
            if(db1[i1][k1] == db2[i2][k2]){
                db1[i1][k3] = db2[i2][k3]
            }
        }
    }
}

// db1의 k1 값이 일치하는 수를 k2로 추가
function countPlusDB(db, k1, k2){
    for(var i in db){
        db[i][k2] = 0
        for(var j in db){
            if(db[i][k1] == db[j][k1]){
                db[i][k2] += 1;
            }
        }
    }
}

module.exports = function(app){
    // 리뷰 리스트
    app.get("/reviewList", function(req, res){
        var conn = mysql.createConnection(conn_info);
        var sql = " SELECT * FROM memberDB ";
        conn.query(sql, function(error, rows){
            var memberDB = rows;
            var sql = " SELECT * FROM itemDB ";
            conn.query(sql, function(error, rows){
                var itemDB = rows;
                var sql = " SELECT * FROM reviewDB ";
                conn.query(sql, function(error, rows){
                    var reviewDB = rows;
                    conn.end();
                    plusDB(reviewDB, memberDB, "reviewMemberNo", "memberNo", "memberName"); // 회원 이름 추가
                    plusDB(reviewDB, itemDB, "reviewItemNo", "itemNo", "itemImg"); // 아이템 이미지 추가
                    countPlusDB(reviewDB, "reviewItemNo", "reviewCount") // 아이템이 리뷰된 숫자 추가
                    // 정렬
                    var k = req.query.sort;
                    if(typeof k == "undefined"){
                        k = "reviewNo";
                    }
                    sortKey(reviewDB, k);
                    reviewDB.reverse();
                    // 상품별 리뷰 보기
                    var itemNo = req.query.itemNo;
                    if(typeof itemNo != "undefined"){
                        var tempDB = [];
                        for(var i in reviewDB){
                            if(reviewDB[i]["reviewItemNo"] == Number(itemNo)){
                                tempDB.push(reviewDB[i]);
                            }
                        }
                        reviewDB = tempDB;
                    }
                    var page = req.query.page; // 현재 페이지
                    if(typeof page == "undefined" || page == null || page == ""){
                        page = 1;
                    } else {
                        page = Number(page);
                    }
                    var totalSize = reviewDB.length; // 전체 게시글 수
                    var pageSize = 4; // 페이지당 보여지는 글의 수 (설정)
                    var pageStart = (page - 1) * pageSize; // 페이지 내의 글 시작 번호
                    var pageEnd = pageStart + pageSize - 1 // 페이지 내의 글 끝 번호
                    if(pageEnd > totalSize){
                        pageEnd = totalSize;
                    }
                    var pagingSize = 3; // 페이징 크기 (한번에 보이는 페이징 수) (설정)
                    var totalPagingSize = Math.ceil(totalSize / pageSize); // 전체 페이징 수
                    var pagingStart = (Math.floor((page + pagingSize - 1) / pagingSize) - 1) * 3 + 1; // 페이징 시작 번호        
                    var pagingEnd = pagingStart + pagingSize - 1; // 페이징 끝 번호
                    if(pagingEnd > totalPagingSize){
                        pagingEnd = totalPagingSize;
                    }
                    var prev = pagingStart - pagingSize; // 이전 페이지
                    var next = pagingStart + pagingSize; // 이후 페이지
                    if(next > totalPagingSize){
                        next = -1;
                    }
                    var renderData = {
                        "log" : req.session.log,
                        "name" : req.session.name,
                        "reviewDB" : reviewDB.slice(pageStart, pageEnd + 1),
                        "page" : page,
                        "pagingStart" : pagingStart,
                        "pagingEnd" : pagingEnd,
                        "prev" : prev,
                        "next" : next,
                        "totalPagingSize" : totalPagingSize
                    }
                    res.render("review/reviewList.ejs", renderData); 
                }); 
            }); 
        });
    });
    
    // 리뷰 읽기
    app.get("/review", function(req, res){
        var reviewNo = req.query.reviewNo;
        
        var conn = mysql.createConnection(conn_info);
        var sql = " SELECT * FROM itemDB ";
        conn.query(sql, function(error, rows){
            var itemDB = rows;
            var sql = " SELECT * FROM reviewDB ";
            conn.query(sql, function(error, rows){
                var reviewDB = rows;
                plusDB(reviewDB, itemDB, "reviewItemNo", "itemNo", "itemImg"); // 아이템 이미지 추가
                var review;
                for(var i in reviewDB){
                    if(reviewDB[i]["reviewNo"] == Number(reviewNo)){
                        review = reviewDB[i];
                        break;
                    }
                }
                
                var itemScore = 0;
                var count = 0;
                for(var i in reviewDB){
                    if(reviewDB[i]["reviewItemNo"] == review["reviewItemNo"]){
                        count += 1;
                        itemScore += reviewDB[i]["reviewScore"];
                    }
                }
                itemScore = (itemScore / count).toFixed(1);
                
                var itemName;
                for(var i in itemDB){
                    if(itemDB[i]["itemNo"] == review["reviewItemNo"]){
                        itemName = itemDB[i]["itemName"];
                    }
                }
                
                // 회원 번호
                var sql = " SELECT * FROM memberDB ";
                conn.query(sql, function(error, rows){
                    conn.end();
                    var memberDB = rows;
                    var log = req.session.log;
                    var memberNo;
                    for(var i in memberDB){
                        if(memberDB[i]["memberId"] == log){
                            memberNo = memberDB[i]["memberNo"];
                        }
                    }
                    var renderData = {
                        "log" : log,
                        "name" : req.session.name,
                        "review" : review,
                        "itemScore" : itemScore,
                        "itemName" : itemName,
                        "memberNo" : memberNo
                    }
                    res.render("review/review.ejs", renderData);
                });
                
            }); 
        });
    });
    
    // 리뷰 좋아요
    app.get("/reviewLike", function(req, res){
        var log = req.session.log;
        var reviewNo = req.query.reviewNo;
        var conn = mysql.createConnection(conn_info);
        var sql = " SELECT * FROM reviewLikeDB ";
        conn.query(sql, function(error, rows){
            var reviewLikeDB = rows;
            var check = false;
            for(var i in reviewLikeDB){ // 이미 누른 회원인지 체크
                if(reviewLikeDB[i]["id"] == log && reviewLikeDB[i]["reviewNo"] == reviewNo){
                    check = true;
                    break;
                }
            }
            if(check){ // 이미 누른 회원   
                // db 에서 삭제
                var sql = "DELETE FROM reviewLikeDB WHERE id = ? AND reviewNo = ? ";
                var inputData = [log, reviewNo];
                conn.query(sql, inputData, function(error){});
                // 좋아요 감소
                var sql = " UPDATE reviewDB SET reviewLike = reviewLike - 1 WHERE reviewNo = ? ";
                var inputData = [reviewNo];
                conn.query(sql, inputData, function(error){});
            } else { // 처음 누른 회원
                // db 에 추가
                var sql = "INSERT INTO reviewLikeDB VALUES(?, ?) ";
                var inputData = [reviewNo, log];
                conn.query(sql, inputData, function(error){});
                // 좋아요 증가
                var sql = " UPDATE reviewDB SET reviewLike = reviewLike + 1 WHERE reviewNo = ? ";
                var inputData = [reviewNo];
                conn.query(sql, inputData, function(error){});
            }
            conn.end();
            res.redirect("review?reviewNo=" + reviewNo);
        });
    });
    
    // 리뷰 싫어요
    app.get("/reviewDislike", function(req, res){
        var log = req.session.log;
        var reviewNo = req.query.reviewNo;
        var conn = mysql.createConnection(conn_info);
        var sql = " SELECT * FROM reviewDislikeDB ";
        conn.query(sql, function(error, rows){
            var reviewDislikeDB = rows;
            var check = false;
            for(var i in reviewDislikeDB){ // 이미 누른 회원인지 체크
                if(reviewDislikeDB[i]["id"] == log && reviewDislikeDB[i]["reviewNo"] == reviewNo){
                    check = true;
                    break;
                }
            }
            if(check){ // 이미 누른 회원
                // 좋아요 감소
                var sql = " UPDATE reviewDB SET reviewDislike = reviewDislike - 1 WHERE reviewNo = ? ";
                var inputData = [reviewNo];
                conn.query(sql, inputData, function(error){});
                // db 에서 삭제
                var sql = "DELETE FROM reviewDislikeDB WHERE id = ? AND reviewNo = ? ";
                var inputData = [log, reviewNo];
                conn.query(sql, inputData, function(error){});                
            } else { // 처음 누른 회원
                // 좋아요 증가
                var sql = " UPDATE reviewDB SET reviewDislike = reviewDislike + 1 WHERE reviewNo = ? ";
                var inputData = [reviewNo];
                conn.query(sql, inputData, function(error){});
                // db 에 추가
                var sql = "INSERT INTO reviewDislikeDB VALUES(?, ?) ";
                var inputData = [reviewNo, log];
                conn.query(sql, inputData, function(error){});
            }
            conn.end();
            res.redirect("review?reviewNo=" + reviewNo);
        });
    });
    
    // 리뷰 작성 form
    app.get("/reviewWrite", function(req, res){
        var itemDB;
        var conn = mysql.createConnection(conn_info);
        var sql = " SELECT * FROM itemDB ";
        conn.query(sql, function(error, rows){
            itemDB = rows;
            conn.end();
            var renderData = {
                "log" : req.session.log,
                "name" : req.session.name,
                "itemDB" : itemDB
            };
            res.render("review/reviewWriteForm.ejs", renderData);
        });
    });
    
    // 리뷰 작성 pro
    app.get("/reviewWritePro", function(req, res){
        var q = req.query;
        var itemNo = q.itemNo;
        var score = q.score;
        var content = q.content;
        var image = q.image;
        var log = req.session.log;
        
        var conn = mysql.createConnection(conn_info);
        var sql = " SELECT * FROM memberDB ";
        conn.query(sql, function(error, rows){
            var memberDB = rows;    
            var sql = " SELECT * FROM reviewDB ";
            conn.query(sql, function(error, rows){
                var reviewDB = rows;
                // 글번호 = 가장 큰 번호 + 1
                var reviewNo = 0;
                for(var i in reviewDB){
                    if(reviewDB[i]["reviewNo"] > reviewNo){
                        reviewNo = reviewDB[i]["reviewNo"];
                    }
                }
                reviewNo += 1;
                
                // 회원번호
                var memberNo;
                for(var i in memberDB){
                    if(memberDB[i]["memberId"] == log){
                        memberNo = memberDB[i]["memberNo"];
                        break;
                    }
                }
                
                // 작성일
                var today = "";
                var date = new Date();
                today += date.getFullYear() + ".";
                var month = date.getMonth() + 1;
                if(month < 10){
                    month = "0" + month;
                }
                today += month + "." + date.getDate();
                
                // 이미지 (확장자 지우기)
                //image = image.substring(0, image.indexOf("."));
                
                // 이미지 업로드
                
                image = Math.floor(Math.random() * 20) + 1;
                image = "reviewImg" + image;
                
                var review = {
                    "reviewNo" : reviewNo, 
                    "reviewMemberNo" : memberNo, 
                    "reviewItemNo": itemNo, 
                    "reviewDate" : today, 
                    "reviewImage" : image, 
                    "reviewScore" : score, 
                    "reviewLike" : 0, 
                    "reviewDislike" : 0, 
                    "reviewContent" : content
                };
                
                var sql = " INSERT INTO reviewDB VALUES(?,?,?,?,?,?,?,?,?) ";
                var inputData = [];
                for(var i in review){
                    inputData.push(review[i]);
                }
                conn.query(sql, inputData, function(error){});
                conn.end();
                res.redirect("reviewList");                
            });
        });
    });
    
    // 리뷰 수정 Form
    app.get("/reviewUpdateForm", function(req, res){
        var reviewNo = req.query.reviewNo;

        var conn = mysql.createConnection(conn_info);
        var sql = " SELECT * FROM itemDB ";
        conn.query(sql, function(error, rows){
            var itemDB = rows;
            var sql = " SELECT * FROM reviewDB ";
            conn.query(sql, function(error, rows){
                var reviewDB = rows;
                plusDB(reviewDB, itemDB, "reviewItemNo", "itemNo", "itemImg"); // 아이템 이미지 추가
                var review;
                for(var i in reviewDB){
                    if(reviewDB[i]["reviewNo"] == Number(reviewNo)){
                        review = reviewDB[i];
                        break;
                    }
                }
                
                var itemScore = 0;
                var count = 0;
                for(var i in reviewDB){
                    if(reviewDB[i]["reviewItemNo"] == review["reviewItemNo"]){
                        count += 1;
                        itemScore += reviewDB[i]["reviewScore"];
                    }
                }
                itemScore = (itemScore / count).toFixed(1);
                
                var itemName;
                for(var i in itemDB){
                    if(itemDB[i]["itemNo"] == review["reviewItemNo"]){
                        itemName = itemDB[i]["itemName"];
                    }
                }
                
                // 회원 번호
                var sql = " SELECT * FROM memberDB ";
                conn.query(sql, function(error, rows){
                    conn.end();
                    var memberDB = rows;
                    var log = req.session.log;
                    var memberNo;
                    for(var i in memberDB){
                        if(memberDB[i]["memberId"] == log){
                            memberNo = memberDB[i]["memberNo"];
                        }
                    }
                    var renderData = {
                        "log" : log,
                        "name" : req.session.name,
                        "review" : review,
                        "itemScore" : itemScore,
                        "itemName" : itemName,
                        "memberNo" : memberNo,
                        "itemDB" : itemDB
                    }
                    res.render("review/reviewUpdateForm.ejs", renderData);
                });
                
            }); 
        });
        
    });
    
    // 리뷰 수정 Pro
    app.get("/reviewUpdatePro", function(req, res){
        var q = req.query;
        var score = Number(q.score);
        var content = q.content;
        var image = q.image;
        var reviewNo = Number(q.reviewNo);
        
        image = Math.floor(Math.random() * 20) + 1;
        image = "reviewImg" + image;
        
        var conn = mysql.createConnection(conn_info);
        var sql = " UPDATE reviewDB SET reviewScore = ?, reviewImage = ?, reviewContent = ? WHERE reviewNo = ? ";
        var inputData = [score, image, content, reviewNo];
        conn.query(sql, inputData, function(error){});
        conn.end();
        res.redirect("review?reviewNo=" + reviewNo);
    });
    
    
    // 리뷰 삭제 Pro
    app.get("/reviewDeletePro", function(req, res){
        var reviewNo = req.query.reviewNo;
        
        var conn = mysql.createConnection(conn_info);
        var sql = " DELETE FROM reviewDB WHERE reviewNo = ? ";
        var inputData = [reviewNo];
        conn.query(sql, inputData, function(error){});
        conn.end();
        
        res.redirect("reviewList");
    });
    
};