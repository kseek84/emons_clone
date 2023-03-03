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

// db의 k(key)의 값 중 가장 큰 값 리턴
function getMaxFromDB(db, k){
    var max = 0;
    for(var i in db){
        if(db[i][k] > max){
            max = db[i][k];
        }
    }
    return max;
}

// db(DB) 에 d(data) 추가
function insertDB(db, d){
    var conn = mysql.createConnection(conn_info); // db 연결
    var sql = " INSERT INTO " + db + " VALUES(?,?,?,?,?,?) "; // db 쿼리 작성
    var inputData = [];
    for(var i in d){
        inputData.push(d[i]);
    }
    
    conn.query(sql, inputData, function(error){
        conn.end();
    });
}

module.exports = function(app){
    
    app.get("/memberLogin", function(req, res){
        res.render("member/memberLogin.ejs");
    });
    
    app.get("/memberLoginPro", function(req, res){

        var id = req.query.id;
        var pw = req.query.pw;
        var log = null;
        var name = null;

        var conn = mysql.createConnection(conn_info); // db 연결
        var sql = " SELECT  * FROM memberDB "; // db 쿼리 작성
        
        conn.query(sql, function(error, rows){
            
            var memberDB = rows;
            
            conn.end(); // 연결종료
  
            for(var i in memberDB){
                if(memberDB[i]["memberId"] == id && memberDB[i]["memberPw"] == pw){
                    log = id;
                    name = memberDB[i]["memberName"];
                    break;
                }
            }
            
            if(log == null){
                res.redirect("memberLogin");
                return;
            }
            
            req.session.log = id;
            req.session.name = name;

            res.redirect("main");             
        });
    });
    
    app.get("/memberLogout", function(req, res){
        req.session.log = null;
        req.session.name = null;
        res.redirect("memberLogin");
    });
    
    app.get("/memberJoin", function(req, res){
        res.render("member/memberJoin.ejs");
    });
    
    app.get("/memberJoinForm", function(req, res){
        res.render("member/memberJoinForm.ejs");
    });
    
    // 회원 가입 pro
    app.get("/memberJoinPro", function(req, res){
        
        var q = req.query;
        
        var id = q.id;
        var pw = q.pw;
        var name = q.name;
        var email = q.email;
        var jumin = q.jumin;
        
        var conn = mysql.createConnection(conn_info); // db 연결
        var sql = " SELECT  * FROM memberDB "; // db 쿼리 작성
        
        conn.query(sql, function(error, rows){
            
            var memberDB = rows;
            
            conn.end(); // 연결종료
            
            // 아이디 중복 검사
            var check = false;
            for(var i in memberDB){
                if(memberDB[i]["memberDB"] == id){
                    check = true;
                    break;
                }
            }
            // 주민번호 검사
            var gender = Number(jumin[6]); // 끝자리 1~4 만 가능
            check = 0 == gender || 4 < gender;     
            
            if(check){ // 아이디 중복 or 주민번호 오류
                res.redirect("memberJoinForm");
            } else {
                var no = getMaxFromDB(memberDB, "memberNo");
                // db에 회원 정보 추가
                var member = {
                    "memberNo" : no + 1,
                    "memberId" : id,
                    "memberPw" : pw,
                    "memberName" : name,
                    "memberEmail" : email,
                    "memberBirth" : jumin
                };
                insertDB("memberDB", member);
                
                req.session.log = id;
                req.session.name = name;
                
                res.redirect("main");
            }
            
        });
        
        
    });
    
    // 회원정보
    app.get("/memberInfo", function(req, res){
        
        var log = req.session.log;
        var name = req.session.name;

        if(typeof log == "undefined" || log == null || log == ""){
            res.redirect("memberLogin");
            return;
        }
        
        var conn = mysql.createConnection(conn_info); // db 연결
        var sql = " SELECT * FROM memberDB "; // db 쿼리 작성
        
        conn.query(sql, function(error, rows){
            var memberDB = rows;
            conn.end();
            
            var member;
            for(var i in memberDB){
                if(memberDB[i]["memberId"] == log){
                    member = memberDB[i];
                    break;
                }
            }
            
            var renderData = {
                "log" : log,
                "name" : name,
                "member": member     
            };
            
            res.render("member/memberInfo.ejs", renderData);
        });
    });
    
    // 회원정보 수정 pro
    app.get("/memberInfoUpdate", function(req, res){
        var q = req.query;
        
        var id = q.id;
        var pw = q.pw;
        var name = q.name;
        var email = q.email;
        var jumin = q.jumin;
        
        var log = req.session.log;
        
        var conn = mysql.createConnection(conn_info); // db 연결
        var sql = " SELECT * FROM memberDB ";
        
        conn.query(sql, function(error, rows){
            var memberDB = rows;
            var memberNo;
             // 아이디 중복 검사
            var check = false;
            for(var i in memberDB){
                if(memberDB[i]["memberId"] == log){
                    memberNo = memberDB[i]["memberNo"];
                    continue;
                }
                else if(memberDB[i]["memberId"] == id){
                    check = true;
                    break;
                }
            }
            // 주민번호 검사
            var gender = Number(jumin[6]); // 끝자리 1~4 만 가능
            check = 0 == gender || 4 < gender;     
            
            if(!check){ // 아이디 중복 or 주민번호 오류 아님
                
                var sql = " UPDATE memberDB "; 
                sql += " SET memberId = ?, memberPw = ? , memberName = ? , memberEmail = ? , memberBirth = ? "; 
                sql += " WHERE memberNo = ? ";
                var inputData = [id, pw, name, email, jumin, memberNo];
                
                conn.query(sql, inputData, function(error){
                    conn.end();
                    req.session.log = id;
                    req.session.name = name;
                    res.redirect("memberInfo");
                });
            } else {
                conn.end();
                res.redirect("memberInfo");
            }
            
        });
        
       
    });
    
    // 회원 탈퇴
    app.get("/memberOut", function(req, res){
        var log = req.session.log;
        
        var conn = mysql.createConnection(conn_info);
        var sql = " DELETE FROM memberDB WHERE memberId = ?";
        var inputData = [log];
        conn.query(sql, inputData, function(error){
            req.session.log = null;
            req.session.name = null;
            res.redirect("memberJoin");    
        });
        
    });
};