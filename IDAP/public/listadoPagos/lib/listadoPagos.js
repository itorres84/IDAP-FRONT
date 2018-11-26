$(document).ready(function(){

    var uid = $.getUID();
    $.showLoading();
    console.log("UID", uid);
    var starCountRef = firebase.database().ref('users/' + uid + '/payments');
        starCountRef.on('value', function(snapshot) {
        $.hideLoading();
        $("#cuerpo_pagos").empty();
        if (snapshot.exists()){
            
            snapshot.forEach(function(childSnapshot) {
                var childData = childSnapshot.val();
                var myDate = new Date(1000*childData.created_at);
                var montstr = childData.amount.toString()
                var res = montstr.substring(0, (montstr.length - 2));
                console.log(res)
                var a = parseInt(res)
                var num = '$' + a.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

                $("#cuerpo_pagos").append("<tr><td>"+childData.line_items.data[0].name+"</td>" +
                                          "<td>"+myDate.toLocaleString("es-ES")+"</td>"+
                                          "<td>"+num+"</td>"+
                                          "<td>No</td></tr>");

            });

        }else{
            console.log("No hay nada")
        }
    });

    $("#newPayment").click(function(e) {
        e.preventDefault();
        $("#container").empty().load('nuevoPago/nuevoPago.html');
        $.getScript("nuevoPago/lib/nuevoPago.js");
        return false;
    });

});