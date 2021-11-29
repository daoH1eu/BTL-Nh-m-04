var socket = io("http://localhost:6060")

// socket.on('server-update-data', function (data) {
//     // Home page
//     //-------------------Insert data into HTML element---------------------
//     console.log(data)
//     $("#id").html(data[0].id)
//     $("#owner").html(data[0].owner)
//     $("#plateNumber").html(data[0].plateNumber)
//     $("#address").html(data[0].address)
//     $("#mark").html(data[0].mark)
//     $("#model").html(data[0].model)
//     $("#type").html(data[0].type)
// })

// socket.on('server-update-data', function (data) {
//     $(".parkedList").append("<tr class='info-container'>" + "<th scope='row' class='id-parked'>" + data.id + "</th>" + "<td class='plateNumber-parked'>" + data.plateNumber + "</td>" + "<td class='owner-parked'>" + data.owner + "</td>")
//     $('.id-parked').on('click', function() {
//         if($(this).text() == data.id) {

//         }
//     });
    
// })


    $('.slot').on('click', function() {
        $(this).addClass("slot-taken")
    });

socket.on('server-full', function (data) {
    const arr = [];
    for (var i = 0; i < $('.slot').length; i++) {
        var itemText = $($('.slot')[i]).text();
        arr.push(itemText);
    }

    console.log(arr)

    for (var j = 0; j < data.length; j++) {
        for (var k = 0; k < arr.length; k++) {
            if (data[j] == arr[k]) {
                for (var i = 0; i < $('.slot').length; i++) {
                    if ($($('.slot')[i]).text() == arr[k]) {
                        $($('.slot')[i]).addClass('slot-taken')
                    }
                }
            }
        }
    }
})







