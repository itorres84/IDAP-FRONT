$(document).ready(function(){

    let objPayment = $.getJsonPayment()
    console.log(objPayment);
    var a = parseInt(objPayment.monto)
    var num = '$' + a.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

    $("#card").append('<h6>**** **** **** ' + objPayment.tar_Last4 + '</h6>');
    if (objPayment.tar_Brand == "MC"){
        let url = "https://firebasestorage.googleapis.com/v0/b/idap-9501d.appspot.com/o/images%2FpxMastercard-logo.png?alt=media&token=7ed91182-0bd7-4fcd-973f-12dbf3d3407c"
        $("#typeCard").append("<img src='"+url+"' style='width: 45px;height: 35px;'>");
    }else{
        let url = "https://firebasestorage.googleapis.com/v0/b/idap-9501d.appspot.com/o/images%2Fvisa-logo.png?alt=media&token=3c31d67a-b98d-4a9c-b0bd-54d2562d7f4d"
        $("#typeCard").append("<img src='"+url+"' style='width: 40px;height: 40px;'>");
    }
    $("#monto").append('<h6>' + num + '</h6>');
    $("#concepto").append('<h6>' + objPayment.concepto + '</h6>');
    $("#payment").text('Pagar ' + num);

    $('#back').click(function(e){
        e.preventDefault();
        $("#container").empty().load('nuevoPago/nuevoPago.html');
        $.getScript("nuevoPago/lib/nuevoPago.js");
        return false;
    });

    $("#button").click( function(){
        
        console.log("Realiza pago...")



    });


});