// Gõ lệnh node index.js để bắt đầu chạy server

var express = require('express')  // Module xử lí chung
var mysql = require('mysql2')     // Module cho phép sử dụng cơ sở dữ liệu mySQL 

var app = express()
var port = 6060                   // Port của localhost do mình chọn

app.use(express.static("public"))
app.set("views engine", "ejs")
app.set("views", "./views")

var server = require("http").Server(app)
var io = require('socket.io')(server)

app.get('/', function (req, res) {
    res.render('home.ejs')
})

server.listen(port, function () {
    console.log('Server listening on port ' + port)
})

// SQL--------------------------------------
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'new1'
});

//---------------------------------------------CREATE TABLE-------------------------------------------------
con.connect(function (err) {
    if (err) throw err
    console.log("mysql connected")
    var sql1 = "CREATE TABLE IF NOT EXISTS carlist(ID varchar(255), owner varchar(255), platenumber varchar(255), address varchar(255), mark varchar(255), model varchar(255), type varchar(255), img nvarchar(8000), timein datetime, timeout datetime, parkedCheck varchar(255))"
    // var sql1 = "DROP TABLE carlist"
    con.query(sql1, function (err) {
        if (err)
            throw err
    });
})

//------------------------------------------Push data into table---------------------------------------------
var sql2 = "DELETE FROM carlist"   // Xóa giá trị cũ của bảng
con.query(sql2, function (err, result) {
    if (err) throw err;
    console.log("Table reseted");
});
var sql3 = "INSERT INTO carlist(ID, owner, platenumber, address, mark, model, type, img) VALUES ?"   // Chèn giá trị mới vào bảng

var values1 = [
    ["2597410477", "Phạm Văn Hưng",     "34A-000.00", "Hải Dương",  "Mercedes",  "c300",  "Sedan"                  , "https://scontent.fhph1-2.fna.fbcdn.net/v/t1.6435-9/180707342_1815457628624169_2199669668745554842_n.jpg?_nc_cat=103&ccb=1-3&_nc_sid=730e14&_nc_ohc=endTPehcCq8AX8eUPdc&_nc_ht=scontent.fhph1-2.fna&oh=5927346e19bf6b3d3511ee8a67b55a3b&oe=60B656BC"],
    ["437994932" , "Vũ Văn Thành",      "18A-111.11", "Nam Định",   "Audi",      "A6",    "Sedan"                  , "https://scontent-hkt1-2.xx.fbcdn.net/v/t1.6435-9/179542248_1815457565290842_6445247648051033521_n.jpg?_nc_cat=104&ccb=1-3&_nc_sid=730e14&_nc_ohc=L2cxfCI-DwoAX-IV_zi&_nc_ht=scontent-hkt1-2.xx&oh=9c562e943da696db51c1a046d35b8f5c&oe=60B3D5B9"],
    ["173351604" , "Nguyễn Quang Huy",  "98A-222.22", "Bắc Giang",  "Mercedes",  "e300",  "Sedan"                  , "https://scontent.fhph1-2.fna.fbcdn.net/v/t1.6435-9/181066673_1815457675290831_4188386900028470154_n.jpg?_nc_cat=105&ccb=1-3&_nc_sid=730e14&_nc_ohc=ddawvGfTpRAAX8baKGX&_nc_ht=scontent.fhph1-2.fna&oh=9cd77d088c140ef9fdd5defd579e1035&oe=60B58602"],
    ["169959347" , "Ngô Quang Trường",  "14A-999.99", "Quảng Ninh", "Lexus",     "LX570", "Sedan"                  , "https://scontent-hkt1-2.xx.fbcdn.net/v/t1.6435-9/180578775_1815457751957490_4029283961828514335_n.jpg?_nc_cat=110&ccb=1-3&_nc_sid=730e14&_nc_ohc=ZZWhb9xDtCYAX93Ixvd&_nc_ht=scontent-hkt1-2.xx&oh=c4c4d0a4fcce706a5c0735630931f8f5&oe=60B5333D"],
    ["1523457715", "Lê Tùng Linh",      "37A-444.44", "Nghệ An",    "Race car",  "F1",    "Xe đua"                 , "https://scontent.fhph1-2.fna.fbcdn.net/v/t1.6435-9/179601505_1815457718624160_9140420116812598786_n.jpg?_nc_cat=105&ccb=1-3&_nc_sid=730e14&_nc_ohc=YewpSL-rLUYAX8YCAVT&_nc_ht=scontent.fhph1-2.fna&oh=fbc6e6359ca5802d667898129c4740c0&oe=60B5E8D5"],
    ["709308339" , "Hoàng Tất Thăng",   "90A-555.55", "Hà Nam",     "Mercedes",  "e250",  "Sedan"                  , "https://scontent-hkt1-2.xx.fbcdn.net/v/t1.6435-9/178577670_1815457655290833_8994333958395032615_n.jpg?_nc_cat=102&ccb=1-3&_nc_sid=730e14&_nc_ohc=h_eWjKmRPqYAX-W1PVn&_nc_oc=AQkeJGjHiKlNb_EmE2sC9Yvtw2PC_UQKPl9rN1JkX0V9nYUWSfCfyOT0iDGM7IsMf68&_nc_ht=scontent-hkt1-2.xx&oh=792810939303470574c1fd674365b559&oe=60B324FF"],
    ["1253160109", "Trương Đình Quang", "99A-666.66", "Bắc Ninh",   "Mercedes",  "e350",  "Sedan"                  , "https://scontent-hkt1-2.xx.fbcdn.net/v/t1.6435-9/177548890_1815457681957497_9095236878488124254_n.jpg?_nc_cat=109&ccb=1-3&_nc_sid=730e14&_nc_ohc=sYfwjgww2xYAX91n6aF&_nc_ht=scontent-hkt1-2.xx&oh=804a8faaadfec1f60381c0cdca5c1def&oe=60B69969"],
    ["1793178798", "Hà Quang Khải",     "29A-777.77", "Lào Cai",    "Mercedes",  "e400",  "Sedan"                  , "https://scontent-hkt1-2.xx.fbcdn.net/v/t1.6435-9/180496641_1815457698624162_821801021190296899_n.jpg?_nc_cat=111&ccb=1-3&_nc_sid=730e14&_nc_ohc=21aFbBxbnuQAX-W0yJ6&_nc_ht=scontent-hkt1-2.xx&oh=c5b1201a0c54e618114638345b65ee78&oe=60B4D944"],
    ["2862040756", "Nguyễn Đức Hà",     "29A-333.33", "Hà Nội",     "Audi",      "Q7",    "Sedan"                  , "https://scontent-hkt1-2.xx.fbcdn.net/v/t1.6435-9/181974895_1815457785290820_3862496849672862378_n.jpg?_nc_cat=106&ccb=1-3&_nc_sid=730e14&_nc_ohc=Qd4HBenFXkoAX8x7UiZ&_nc_ht=scontent-hkt1-2.xx&oh=d23f24f56c787e1176bc63a08c07ae45&oe=60B468C5"],
    ["708590772" , "Đào Minh Hiếu",     "29A-888.88", "Hà Nội",     "Mercedes",  "c300",  "Sedan"                  , "https://scontent.fhph1-1.fna.fbcdn.net/v/t1.6435-9/180593861_1815457635290835_7151815709381387466_n.jpg?_nc_cat=100&ccb=1-3&_nc_sid=730e14&_nc_ohc=TnGbgwQXUS8AX8_bQY0&_nc_ht=scontent.fhph1-1.fna&oh=0289c89c5351e2754064bf9413d417c3&oe=60B4C3A0"],
    ["974857140" , "Lê Văn Đại Đinh",   "29A-123.45", "Hà Nội",     "Mercedes",  "c200",  "Sedan"                  , "https://scontent-hkt1-2.xx.fbcdn.net/v/t1.6435-9/179517514_1815457601957505_1821232219301106275_n.jpg?_nc_cat=111&ccb=1-3&_nc_sid=730e14&_nc_ohc=cpDkSLJc0w8AX-Q4Yel&_nc_ht=scontent-hkt1-2.xx&oh=2ee60ac257d5df62b70a22b4dba4cbb5&oe=60B4CC21"],
    ["179273645" , "Phạm Đăng Trà",     "17A-234.56", "Thái Bình",  "Mercedes",  "GT63s", "Sedan"                  , "https://scontent-hkt1-2.xx.fbcdn.net/v/t1.6435-9/179038343_1815457585290840_3579452118800305683_n.jpg?_nc_cat=110&ccb=1-3&_nc_sid=730e14&_nc_ohc=B6muDiawTPwAX-dMGTM&_nc_ht=scontent-hkt1-2.xx&oh=26d9daeeebdbcf912bc9e40ff4f13098&oe=60B6DE34"],
    ["181764013" , "Bùi Xuân Tuấn",     "36A-345.67", "Thanh Hóa",  "Audi",      "A8",    "Sedan"                  , "https://scontent-hkt1-2.xx.fbcdn.net/v/t1.6435-9/181543091_1815457568624175_4190956275871491434_n.jpg?_nc_cat=111&ccb=1-3&_nc_sid=730e14&_nc_ohc=BY86U3wEuqAAX_hwz-W&_nc_ht=scontent-hkt1-2.xx&oh=9d73c5275ec5f4d029e79c7a1dde41b1&oe=60B3D3CC"],
    ["3938217902", "Kiều Anh Quân",     "99A-456.78", "Bắc Ninh",   "Công nông", "1970",  "Phương tiện chiến tranh", "https://scontent.fhph1-2.fna.fbcdn.net/v/t1.6435-9/181483264_1815457825290816_6973911146986463878_n.jpg?_nc_cat=103&ccb=1-3&_nc_sid=730e14&_nc_ohc=CfABfB2QZxwAX_IA-tF&_nc_ht=scontent.fhph1-2.fna&oh=c641cdb4456f2c1d048e5f9287a8e183&oe=60B5B372"],
    ["1793031853", "Phạm Tuấn Anh",     "17A-567.89", "Thái Bình",  "Mercedes",  "s450",  "Sedan"                  , "https://scontent-hkt1-2.xx.fbcdn.net/v/t1.6435-9/181814673_1815457818624150_2168687255525457590_n.jpg?_nc_cat=109&ccb=1-3&_nc_sid=730e14&_nc_ohc=-9nCaZu6-pYAX-4Hxk3&_nc_ht=scontent-hkt1-2.xx&oh=257eafd62ee38683506da2d985da88d6&oe=60B46774"],
    ["3938407853", "Ngô Ngọc Thương",   "18A-121.21", "Nam Định",   "Lexus",     "RX350", "Sedan"                  , "https://scontent-hkt1-2.xx.fbcdn.net/v/t1.6435-9/177511540_1815457801957485_2545042095931967971_n.jpg?_nc_cat=107&ccb=1-3&_nc_sid=730e14&_nc_ohc=FIqWxQ5_AQQAX-8F3HN&_nc_ht=scontent-hkt1-2.xx&oh=b8d355fcd90443521fd26ee01c733355&oe=60B68FCD"]
]

con.query(sql3, [values1], function(err) {
    if (err) throw err;
    console.log("Table inserted")
    con.end();
});








