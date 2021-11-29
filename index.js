// Gõ lệnh node index.js để bắt đầu chạy server

var express = require('express')  // Module xử lí chung
var mysql = require('mysql2')     // Module cho phép sử dụng cơ sở dữ liệu mySQL 
var mqtt = require('mqtt')        // Module cho phép sử dụng giao thức mqtt

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

//-----------initialize the MQTT client----------------
var client = mqtt.connect('mqtt://broker.hivemq.com:1883', { clientId: "serverjs1" });
// var topic1 = "led";

// var message = "test message";

console.log("connected flag  " + client.connected);
client.on("connect", function () {
    console.log("connected mqtt " + client.connected);
});

client.on("error", function (error) {
    console.log("Can't connect" + error);
    process.exit(1)
});

//-------subscribe đúng topic trong code arduino để nhận về message---------
client.subscribe("home/quang195/sensors0")
client.subscribe("home/quang195/sensors1")
client.subscribe("home/quang195/sensors2")
client.subscribe("home/quang195/sensors3")
client.subscribe("home/quang195/sensors4")
client.subscribe("home/quang195/sensors5")
client.subscribe("home/quang195/sensors6")
client.subscribe("home/quang195/sensors7")
client.subscribe("home/quang195/sensors8")
client.subscribe("home/quang195/sensors9")
client.subscribe("home/quang195/sensors10")
client.subscribe("home/quang195/sensors11")
client.subscribe("home/quang195/sensors12")
client.subscribe("home/quang195/sensors13")
client.subscribe("home/quang195/sensors14")
client.subscribe("home/quang195/sensors15")
client.subscribe("in")
client.subscribe("out")

// ------Initiate mySQL connection-------------
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'truongpro99',
    database: 'smart-parking-lot'
});

//-----------------RFID variables--------------


// //------------Recieve message---------------------------------
// var cnt_check = 0;
// client.on('message', function (topic, message) {
//     console.log("message is " + message)
//     console.log("topic is " + topic)
//     const objData = JSON.parse(message)
//     if (topic == topic_list[0]) {
//         cnt_check = cnt_check + 1
//         currentID = objData.id
//         slot      = objData.slot
//     }

//     if (cnt_check == 1) {
//         cnt_check = 0
//         console.log("Ready to save")
//         var n = new Date()
//         var month  = n.getMonth() + 1
//         var timeIn = n.getFullYear() + "-" + month + "-" + n.getDate() + " " + n.getHours() + ":" + n.getMinutes() + ":" + n.getSeconds();
//         console.log(timeIn)
//         var sql = "INSERT INTO carlist WHERE ID = '" + currentID + "' (timeIn) VALUES ('" + timeIn.toString().slice(4, 24) + "')"
//         con.query(sql, function (err, result) {
//             if (err) throw err;
//             console.log("Table inserted");
//             console.log(currentID + " " + timeIn)
//         })

//         // var sql1 = "SELECT * FROM sensors11 ORDER BY ID DESC limit 1"
//         // con.query(sql1, function (err, result) {
//         //     if (err) throw err;
//         //     console.log("Data selected");
//         //     result.forEach(function (value) {
//         //         m_time = value.Time.toString().slice(4, 24);
//         //         newTemp = value.Temperature
//         //         newHumi = value.Humidity
//         //         console.log(m_time + " " + value.Temperature + " " + value.Humidity);

//         //         io.sockets.emit('server-update-data', { id: value.ID, time: m_time, temp: value.Temperature, humi: value.Humidity })
//         //     })


//         //     io.sockets.emit("server-send-humi_graph", humi_graph);
//         //     io.sockets.emit("server-send-temp_graph", temp_graph);
//         //     io.sockets.emit("server-send-date_graph", date_graph);
//         // })
//     }
// })

//-------------------Choose data from RFID---------------------

// Topic 1 (in) : Tag_ID, Time_in , Day_in
// Topic 2 (out): Tag_ID, Time_out, Day_out, Total_time, Cost 
var tagIdIn
var timeIn
var dayIn
var timeInList = []
var dayInList  = []

var tagIdOut
var timeOut
var dayOut
var totalTime
var cost
var timeOutList = []
var dayOutList  = []

var idInList = [] // id recieved from topic
var cnt_check = 0;
client.on('message', function(topic, message) {
    if(topic === 'in') {
        cnt_check = cnt_check + 1
        tagIdIn = message.Tag_ID
        timeIn   = message.Time_in
        dayIn    = message.Day_in

        // Chèn tagIdIn vào mảng idInList
        idInList.push(tagIdIn)
        console.log(idInList)
    }

    if(topic === 'out') {
        cnt_check = cnt_check + 1
        tagIdOut  = message.Tag_ID
        timeOut   = message.Time_out
        dayOut    = message.Day_out
        totalTime = message.Total_time
        cost      = message.Cost

        // Đối chiếu tagIdOut với mảng idInList, nếu có trùng thì gỡ phần tử đó khỏi mảng
        for (var i = 0; i < idInList.length; i++) {
            if (tagIdOut == idInList[i]) {
                var index = idInList.indexOf(tagIdOut);
                if (index > -1) {
                    idInList.splice(index, 1)
                }
            }
        }
        console.log(idInList)
    }

    if (cnt_check == 1) {
        cnt_check = 0
        var sql1 = "SELECT * FROM carlist"
        con.query(sql1, function (err, result) {
            if (err) throw err;
            console.log("Full data selected");
            var fullData = []
            result.forEach(function (value) {
                fullData.push({ id: value.ID, owner: value.owner, plateNumber: value.platenumber, address: value.address, mark: value.mark, model: value.model, type: value.type })
                // console.log(fullData)
            })
            var chooseData = []
            for (var j = 0; j < idInList.length; j++) {
                for (var i = 0; i < fullData.length; i++) { 
                    if (idInList[j] == fullData[i].id) {
                        chooseData.push(fullData[i])
                    }
                }
            }    

            io.sockets.emit('server-update-data', chooseData)

        })
    }


})
// io.on('connection', function (socket) {
//     socket.on('disconnect', function () {
//         console.log(socket.id + " disconnected")
//     })
    // ------------------Full data select-------------------------

//     var sql1 = "SELECT * FROM carlist"
//     con.query(sql1, function (err, result) {
//         if (err) throw err;
//         console.log("Full data selected");
//         var fullData = []
//         result.forEach(function (value) {
//             fullData.push({ id: value.ID, owner: value.owner, plateNumber: value.platenumber, address: value.address, mark: value.mark, model: value.model, type: value.type })
//             console.log(fullData)
//         })
//         var chooseData = []
//         for (var j = 0; j < idMessage.length; j++) {
//             for (var i = 0; i < fullData.length; i++) { 
//                 if (idMessage[j] == fullData[i].id) {
//                     var x = JSON.stringify(fullData[i].img)
//                     fullData[i].img = x
//                     chooseData.push(fullData[i])
//                 }
//             }
//         }

//         io.sockets.emit('server-update-data', chooseData)
//         console.log(chooseData)
//     })
// })

//--------------Change parking grid HTML element-----------------
var parkedSlot = []
var cnt_check2 = 0
client.on('message', function(topic, message) {
    if (topic === 'home/quang195/sensors0') {
        if (message == 1) {
            cnt_check2 = cnt_check2 + 1
        }
        if (cnt_check2 == 1) {
            parkedSlot.push("A1")
            cnt_check2 = 0
        }
    }

    if (topic === 'home/quang195/sensors1') {
        if (message == 1) {
            cnt_check2 = cnt_check2 + 1
        }
        if (cnt_check2 == 1) {
            parkedSlot.push("A2")
            cnt_check2 = 0
        }
    }

    if (topic === 'home/quang195/sensors2') {
        if (message == 1) {
            cnt_check2 = cnt_check2 + 1
        }
        if (cnt_check2 == 1) {
            parkedSlot.push("A3")
            cnt_check2 = 0
        }
    }

    if (topic === 'home/quang195/sensors3') {
        if (message == 1) {
            cnt_check2 = cnt_check2 + 1
        }
        if (cnt_check2 == 1) {
            parkedSlot.push("A4")
            cnt_check2 = 0
        }
    }

    if (topic === 'home/quang195/sensors4') {
        if (message == 1) {
            cnt_check2 = cnt_check2 + 1
        }
        if (cnt_check2 == 1) {
            parkedSlot.push("A5")
            cnt_check2 = 0
        }
    }

    if (topic === 'home/quang195/sensors5') {
        if (message == 1) {
            cnt_check2 = cnt_check2 + 1
        }
        if (cnt_check2 == 1) {
            parkedSlot.push("A6")
            cnt_check2 = 0
        }
    }

    if (topic === 'home/quang195/sensors6') {
        if (message == 1) {
            cnt_check2 = cnt_check2 + 1
        }
        if (cnt_check2 == 1) {
            parkedSlot.push("A7")
            cnt_check2 = 0
        }
    }

    if (topic === 'home/quang195/sensors7') {
        if (message == 1) {
            cnt_check2 = cnt_check2 + 1
        }
        if (cnt_check2 == 1) {
            parkedSlot.push("A8")
            cnt_check2 = 0
        }
    }

    if (topic === 'home/quang195/sensors8') {
        if (message == 1) {
            cnt_check2 = cnt_check2 + 1
        }
        if (cnt_check2 == 1) {
            parkedSlot.push("A9")
            cnt_check2 = 0
        }
    }

    if (topic === 'home/quang195/sensors9') {
        if (message == 1) {
            cnt_check2 = cnt_check2 + 1
        }
        if (cnt_check2 == 1) {
            parkedSlot.push("A10")
            cnt_check2 = 0
        }
    }

    if (topic === 'home/quang195/sensors10') {
        if (message == 1) {
            cnt_check2 = cnt_check2 + 1
        }
        if (cnt_check2 == 1) {
            parkedSlot.push("A11")
            cnt_check2 = 0
        }
    }

    if (topic === 'home/quang195/sensors11') {
        if (message == 1) {
            cnt_check2 = cnt_check2 + 1
        }
        if (cnt_check2 == 1) {
            parkedSlot.push("A12")
            cnt_check2 = 0
        }
    }

    if (topic === 'home/quang195/sensors12') {
        if (message == 1) {
            cnt_check2 = cnt_check2 + 1
        }
        if (cnt_check2 == 1) {
            parkedSlot.push("A13")
            cnt_check2 = 0
        }
    }

    if (topic === 'home/quang195/sensors13') {
        if (message == 1) {
            cnt_check2 = cnt_check2 + 1
        }
        if (cnt_check2 == 1) {
            parkedSlot.push("A14")
            cnt_check2 = 0
        }
    }

    if (topic === 'home/quang195/sensors14') {
        if (message == 1) {
            cnt_check2 = cnt_check2 + 1
        }
        if (cnt_check2 == 1) {
            parkedSlot.push("A15")
            cnt_check2 = 0
        }
    }

    if (topic === 'home/quang195/sensors15') {
        if (message == 1) {
            cnt_check2 = cnt_check2 + 1
        }
        if (cnt_check2 == 1) {
            parkedSlot.push("A16")
            cnt_check2 = 0
        }
    }

    io.sockets.emit('server-update-parkedSlot', parkedSlot)
    

})


io.on('connection', function(socket) {
    var testData = []  
    var testData = ["A2"]
    // var testData = ["A2","C1"]
    // var testData = ["A2","C1","C3"]
    // var testData = ["A2","C1","C3","D4",]
    socket.emit('server-full', testData)
    console.log(testData)
})
