-- ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';

-- DROP DATABASE emons;
CREATE DATABASE emons;

USE emons;

-- 회원 테이블
CREATE TABLE memberDB(
	memberNo INT,
    memberId VARCHAR(20),
    memberPw VARCHAR(20),
    memberName VARCHAR(20),
    memberEmail VARCHAR(50),
    memberBirth CHAR(7)
);

INSERT INTO memberDB VALUES(1, "hello", "1234", "김수혁", "hello@naver.com", "8805051");
INSERT INTO memberDB VALUES(2, "world", "1234", "김혁", "world@google.com", "7705052");
INSERT INTO memberDB VALUES(3, "seoul", "1234", "김수", "seoul@daum.com", "6605052");
INSERT INTO memberDB VALUES(4, "korea", "1234", "김혁수", "korea@naver.com", "1005053");
INSERT INTO memberDB VALUES(5, "usa", "1234", "홍길동", "usa@google.com", "8803031");
INSERT INTO memberDB VALUES(6, "earth", "1234", "홍동길", "earth@naver.com", "0204044");
INSERT INTO memberDB VALUES(7, "apple", "1234", "김길동", "apple@google.com", "8807071");
INSERT INTO memberDB VALUES(8, "banana", "1234", "박길동", "banana@naver.com", "6606062");
INSERT INTO memberDB VALUES(9, "emons", "1234", "수정이", "emons@daum.com", "2101013");
INSERT INTO memberDB VALUES(10, "bed", "1234", "이수정", "bed@google.com", "7707071");
INSERT INTO memberDB VALUES(11, "bluesky", "1234", "손흥민", "son@naver.com", "8805051");
INSERT INTO memberDB VALUES(12, "redsea", "1234", "황희찬", "red@google.com", "7705052");
INSERT INTO memberDB VALUES(13, "blue", "1234", "김민재", "blue@daum.com", "9905052");
INSERT INTO memberDB VALUES(14, "white", "1234", "이강인", "white@naver.com", "9805052");
INSERT INTO memberDB VALUES(15, "black", "1234", "김강인", "black@google.com", "9703031");
INSERT INTO memberDB VALUES(16, "gray", "1234", "이민재", "gray@naver.com", "9604042");
INSERT INTO memberDB VALUES(17, "korea1", "1234", "황흥민", "korea1@google.com", "9507071");
INSERT INTO memberDB VALUES(18, "korea2", "1234", "김흥민", "korea2@naver.com", "2006063");
INSERT INTO memberDB VALUES(19, "korea3", "1234", "이희찬", "korea3@daum.com", "1501013");
INSERT INTO memberDB VALUES(20, "qwer2", "1234", "민희재", "qwer2@google.com", "2207073");

-- 상품 테이블
CREATE TABLE itemDB(
    itemNo INT,
    itemName VARCHAR(100),
    itemModel VARCHAR(20),
    itemPrice INT,
    itemCategory VARCHAR(20),
    itemStock INT,
    itemImg VARCHAR(20),
    itemDiscount INT
);

INSERT INTO itemDB VALUES(1, "[역마진특가] 나띠 3인 천연면피 가죽소파", "나띠", 599000, "거실가구", 55, "1.jpg", 33);
INSERT INTO itemDB VALUES(2, "그루 4인 가죽소파", "그루", 940000, "거실가구", 35, "2.jpg", 33);
INSERT INTO itemDB VALUES(3, "더홈 G1 망입유리 초슬림 3연동 중문 1401-1600", "더홈", 1512000, "거실가구", 5, "3.jpg", 33);
INSERT INTO itemDB VALUES(4, "시에론B 수납형 침대 Q 8H S3매트", "시에론", 1212000, "침실가구", 43, "4.jpg", 33);
INSERT INTO itemDB VALUES(5, "루밍 LED 저상형 패밀리침대 Q_SS INSERT INTO itemDB VALUES(8H S3 독립포켓매트)", "루밍", 2354000, "침실가구", 25, "5.jpg", 33);
INSERT INTO itemDB VALUES(6, "루밍 LED 저상형 패밀리침대 SS_SS INSERT INTO itemDB VALUES(8H S3 독립포켓매트)", "루밍", 2168000, "침실가구", 3, "6.jpg", 33);
INSERT INTO itemDB VALUES(7, "멜로쉬 4인용 헤드틸팅 패브릭 소파", "멜로쉬소파", 1242000, "거실가구", 12, "7.jpg", 33);
INSERT INTO itemDB VALUES(8, "시스티 슬라이딩 붙박이장 화이트흑니켈 300cm 고급", "시스티", 1746000, "침실가구", 46, "8.jpg", 33);
INSERT INTO itemDB VALUES(9, "그루 4인 리클라이너 가죽소파 양쪽홈바형", "그루", 1680000, "거실가구", 88, "9.jpg", 33);
INSERT INTO itemDB VALUES(10, "루밍 LED 저상형 패밀리침대 Q_SS 독립스프링매트", "루밍", 1817000, "침실가구", 66, "10.jpg", 33);
INSERT INTO itemDB VALUES(11, "[역마진특가] 위드 패브릭 소파 오픈형 3인", "위드", 299000, "거실가구", 5, "11.jpg", 33);
INSERT INTO itemDB VALUES(12, "★비밀특가★ 인기 슈퍼싱글 침대 초특가전", "none", 414690, "침실가구", 78, "12.jpg", 33);
INSERT INTO itemDB VALUES(13, "[방수커버증정]시에론 베이직 수납형 침대 SS 독립라텍스매트", "시에론", 670000, "침실가구", 32, "13.jpg", 33);
INSERT INTO itemDB VALUES(14, "[협탁증정]오브제 평상형 패밀리침대 SS+SS 8H S3매트", "오브제", 1848000, "침실가구", 67, "14.jpg", 33);
INSERT INTO itemDB VALUES(15, "체르니 4인 가죽소파 세트 스툴+쿠션포함", "체르니", 1178000, "거실가구", 66, "15.jpg", 33);    
INSERT INTO itemDB VALUES(16, "[방수커버증정]시에론 베이직 수납형 침대 SS 독립라텍스매트/협탁", "시에론", 726000, "침실가구", 23, "16.jpg", 33);    
INSERT INTO itemDB VALUES(17, "컴팩트 3.5인 리클라이너 천연면피 가죽소파 양쪽형", "컴팩트", 899000, "거실가구", 27, "17.jpg", 33);   
INSERT INTO itemDB VALUES(18, "[쿠쿠] 6인용 식기세척기_CDW-BD0620TB", "CDW-BD0620TB", 485000, "주방가전", 70, "18.jpg", 33);
INSERT INTO itemDB VALUES(19, "[쿠쿠] 3구 하이브리드 인덕션레인지INSERT INTO itemDB VALUES(2구인덕션+1구하이라이트)_CIHR-D304FB", "CIHR-D304FB", 549000, "주방가전", 0, "19.jpg", 33);
INSERT INTO itemDB VALUES(20, "[역마진특가] 무이 원목 6인식탁 테이블", "무이", 109000, "식탁", 20, "20.jpg", 33);
INSERT INTO itemDB VALUES(21, "리즈 3단 서랍 800 화장대세트 INSERT INTO itemDB VALUES(수납거울 포함)", "리즈", 211110, "서랍장/수납장", 10, "21.jpg", 33);
INSERT INTO itemDB VALUES(22, "하이유로탑 매트리스 K", "에코벨리", 481000, "매트리스", 100, "22.jpg", 33);
INSERT INTO itemDB VALUES(23, "리즈 3단 서랍 1200 화장대세트 INSERT INTO itemDB VALUES(수납거울 포함)", "리즈", 284000, "서랍장/수납장", 1, "23.jpg", 33);
INSERT INTO itemDB VALUES(24, "[베개1EA+협탁증정]시에론B 수납형 침대 Q 독립라텍스매트", "시에론", 929000, "매트리스", 60, "24.jpg", 33);
INSERT INTO itemDB VALUES(25, "★비밀특가★ 엔트리 시스템 높은 수납장/거실장", "엔트리", 78570, "서랍장/수납장", 0, "25.jpg", 33);
INSERT INTO itemDB VALUES(26, "뉴빅와이드 서랍장 1200 5단", "빅와이드", 365000, "서랍장/수납장", 1, "26.jpg", 33);
INSERT INTO itemDB VALUES(27, "★비밀특가★ 인기 가죽소파 3/4인 초특가전", "나띠", 673090, "소파", 10, "27.jpg", 33);
INSERT INTO itemDB VALUES(28, "[역마진특가] 컴팩트 4인 카우치 천연면피 가죽소파 세트", "컴팩트", 799000, "소파", 100, "28.jpg", 33);
INSERT INTO itemDB VALUES(29, "[10%쿠폰]프레디 1400 베이직 책상 콘센트형", "프레디", 202000, "책상", 20, "29.jpg", 33);
INSERT INTO itemDB VALUES(30, "[역마진특가+식탁유리 무료증정] 무이 원목 4인식탁세트 의자4개", "무이", 277000, "식탁", 0, "30.jpg", 33);
INSERT INTO itemDB VALUES(31, "[쿠쿠] 6인용 IH전기압력 트윈프레셔 사일런스 밥솥_CRP-NHTR0610FW", "CRP-NHTR0610FW", 481000, "주방가전", 70, "31.jpg", 33);
INSERT INTO itemDB VALUES(32, "[30일무료체험] 슬린 리얼 오가닉 매트리스 프리미엄 K", "슬린", 704000, "매트리스", 100, "32.jpg", 33);        
INSERT INTO itemDB VALUES(33, "[30일무료체험] 보에르 호텔 쿠셔닝 매트리스 프리미엄 SS", "보에르", 826000, "매트리스", 50, "33.jpg", 33);
INSERT INTO itemDB VALUES(34, "[5%쿠폰+협탁50%+포토리뷰3만원]플루아 호텔형 수납 침대프레임 SS", "플루아", 562000, "침대", 60, "34.jpg", 33);
INSERT INTO itemDB VALUES(35, "[방수커버증정+5%쿠폰+협탁50%+포토리뷰3만원]플루아 호텔형 수납 침대 Q 하이유로탑매트", "플루아", 1022000, "침대", 0, "35.jpg", 33);

-- 장바구니 테이블
CREATE TABLE cartDB(
    cartNo INT,
    cartItemNo INT,
    cartMemberId VARCHAR(20),
    cartItemName VARCHAR(100),
    cartItemCount INT,
    cartItemImage VARCHAR(20),
    cartItemPrice INT
);

INSERT INTO cartDB VALUES(1, 1, "hello", "[역마진특가] 나띠 3인 천연면피 가죽소파", 1, "1.jpg", 599000);

-- 리뷰 테이블
CREATE TABLE reviewDB(
    reviewNo INT,
    reviewMemberNo INT,
    reviewItemNo INT,
    reviewDate VARCHAR(20),
    reviewImage VARCHAR(20),
    reviewScore INT,
    reviewLike INT,
    reviewDislike INT,
    reviewContent VARCHAR(100)
);

INSERT INTO reviewDB VALUES(1, 1, 1, "2023.01.02", "reviewImg1", 1, 0, 1, "색감이 고급스럽습니다.");
INSERT INTO reviewDB VALUES(2, 3, 2, "2023.01.02", "reviewImg2", 1, 0, 1, "붙박이가 싫어서 통자형으로 시켰어요.");
INSERT INTO reviewDB VALUES(3, 4, 4, "2023.01.02", "reviewImg3", 1, 1, 1, "4통 시켰는데 공간많이 남아서 하나 더시킬까합니다");
INSERT INTO reviewDB VALUES(4, 5, 8, "2023.01.02", "reviewImg4", 5, 3, 1, "먼지가 많이 나왔지만 잘 쓰겠습니다");
INSERT INTO reviewDB VALUES(5, 7, 10, "2023.01.02", "reviewImg5", 4, 5, 1, "하루전 해피콜후 잘배송해주셨습니다");
INSERT INTO reviewDB VALUES(6, 8, 3, "2023.01.02", "reviewImg6", 1, 0, 1, "한 달 넘게 기다리다 받았습니다");
INSERT INTO reviewDB VALUES(7, 20, 5, "2023.01.03", "reviewImg7", 3, 10, 1, "중학생 아이들 책상으로 구입했어요");
INSERT INTO reviewDB VALUES(8, 9, 7, "2023.01.03", "reviewImg8", 1, 0, 1, "책상세트 깔끔하고 좋습니다");
INSERT INTO reviewDB VALUES(9, 2, 9, "2023.01.03", "reviewImg9", 2, 0, 1, "중학생 아이들책상 깔끔하고 너무좋아요");
INSERT INTO reviewDB VALUES(10, 11, 1, "2023.01.03", "reviewImg10", 3, 0, 1, "깔끔하고 너무좋아요 중학생 아이들 책상세트로 구매했어요 애들도 좋아합니다");
INSERT INTO reviewDB VALUES(11, 17, 1, "2023.01.03", "reviewImg11", 2, 2, 3, "만족합니다.");
INSERT INTO reviewDB VALUES(12, 18, 2, "2023.01.04", "reviewImg12", 1, 1, 1, "빨리왔어요.");
INSERT INTO reviewDB VALUES(13, 19, 4, "2023.01.04", "reviewImg13", 4, 0, 1, "늦게왔어요");
INSERT INTO reviewDB VALUES(14, 12, 8, "2023.01.04", "reviewImg14", 5, 3, 11, "그저 그래요");
INSERT INTO reviewDB VALUES(15, 13, 10, "2023.01.04", "reviewImg15", 3, 1, 5, "와 좋다");
INSERT INTO reviewDB VALUES(16, 6, 3, "2023.01.04", "reviewImg16", 4, 10, 12, "좋음");
INSERT INTO reviewDB VALUES(17, 15, 5, "2023.01.04", "reviewImg17", 3, 0, 1, "굿");
INSERT INTO reviewDB VALUES(18, 16, 7, "2023.01.04", "reviewImg18", 1, 20, 1, "배고파");
INSERT INTO reviewDB VALUES(19, 14, 9, "2023.01.04", "reviewImg19", 1, 0, 2, "직접 보고 산게 아니라 걱정이 앞섯지만 그건 기우였네요.");
INSERT INTO reviewDB VALUES(20, 12, 1, "2023.01.04", "reviewImg20", 2, 0, 1, "생각보다 너무 예뻐요");

-- 리뷰 좋아요 테이블
CREATE TABLE reviewLikeDB(
    reviewNo INT,
    id VARCHAR(20)
);


-- 리뷰 싫어요 테이블
CREATE TABLE reviewDislikeDB(
    reviewNo INT,
    id VARCHAR(20)
);

-- 주문 테이블
CREATE TABLE orderDB(
    orderNo INT,
    orderItemNo INT,
    orderMemberId VARCHAR(20),
    orderItemName VARCHAR(100),
    orderItemCount INT,
    orderItemImage VARCHAR(20),
    orderItemPrice INT
);

INSERT INTO orderDB VALUES(1, 1, "hello", "[역마진특가] 나띠 3인 천연면피 가죽소파", 1, "1.jpg", 599000);