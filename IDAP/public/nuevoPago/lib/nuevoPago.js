
Conekta.setPublicKey('key_AtDJLAoxDps2UFyZPbYXkyQ');

var conektaSuccessResponseHandler = function(token) {

    var jsonCard = {
        token_id_card: token.id,
        token_id_user: $.getTokConekta()
    };

    $.ajax ( {
        url: "http://localhost:5001/idap-9501d/us-central1/createPaymentSourceConekta",
        method: "POST",
        dataType: "json",
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jsonCard),
        cache: false,
        headers: {
            "x-user-key": $.getTok()
        },
        async: true,
        success: function(datos){
            $.hideLoading();
            toastr.success('registrada con exito!', 'Tarjeta ' + datos.brand)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.hideLoading()
            toastr.error('Algo salio mal favor de intentarlo mas tarde', 'UPSS!');
        }
    });

  
  };

  var conektaErrorResponseHandler = function(response) {
    $.hideLoading();
    toastr.error('Algo salio mal favor de intentarlo mas tarde', 'UPSS!');
   
};

function pago(key){
    $.sendPayment(key);
}

$(document).ready(function(){

    $("#amount").ForceNumericOnly();
    $("#cvv").ForceNumericOnly();
    $("#cc_numcard").ForceNumericOnly();

    var bander = 0;
    var uid = $.getUID();
    $.showLoading();
    var starCountRef = firebase.database().ref('users/' + uid + '/cards');
    var arrCards = [];
    
    $.sendPayment = function sendPayment(key) {

        var filteredCards = arrCards.filter(function(obj) {
            return (obj.id == key);
        });
        
        let card = filteredCards[0];
    
        if ($('#concepto').val() == "" || $('#concepto').val() == undefined){
            toastr.error('El concepto es necesario para realizar el pago', 'UPSS!');
            return
        }else if ($('#amount').val() == "0"){
            toastr.error('El monto debe ser superior a 0', 'UPSS!');
            return
        }else{
    
            var objPayment = { 
                concepto:$('#concepto').val(), 
                monto:$('#amount').val(),  
                id:card.id,
                tar_Brand:card.brand,
                tar_Last4:card.last4   
            };

            $.setJsonPayment(objPayment)
            $("#container").empty().load('resumenPago/resumenPago.html');
            $.getScript("resumenPago/lib/resumenPago.js");
            
        }



    }

    starCountRef.on('value', function(snapshot) {
        $.hideLoading();
        $("#carruselContent").empty();
        bander = 0
        snapshot.forEach(function(childSnapshot) {
          var childData = childSnapshot.val();
          arrCards.push(childData);
          let urlmc = "https://firebasestorage.googleapis.com/v0/b/idap-9501d.appspot.com/o/images%2FpxMastercard-logo.png?alt=media&token=7ed91182-0bd7-4fcd-973f-12dbf3d3407c"
          let urlvisa = "https://firebasestorage.googleapis.com/v0/b/idap-9501d.appspot.com/o/images%2Fvisa-logo.png?alt=media&token=3c31d67a-b98d-4a9c-b0bd-54d2562d7f4d"  
          let url = childData.brand == "MC" ? urlmc : urlvisa;


          if (bander == 0){

            $("#carruselContent").append("<div class='carousel-item active' style='cursor: pointer;' onclick='pago(\""+childData.id+"\")'>" +
                                         "<div class='basecard'>" +
                                         "<div style='position: absolute; left: 50px; bottom: 90px;'>"+ childData.name +"</div>" + 
                                         "<div style='position: absolute; left: 50px; bottom: 50px;'>**** **** **** "+ childData.last4 +"</div>" +
                                         "<img src='"+url+"' style='position: absolute; right: 20px; bottom: 30px; width: 70px;height: 55px;'>" +
                                         "</div>" + 
                                         "</div>");

          }else{

            $("#carruselContent").append("<div class='carousel-item' style='cursor: pointer;' onclick='pago(\""+childData.id+"\")'>" +
                                         "<div class='basecard'>" +
                                         "<div style='position: absolute; left: 50px; bottom: 90px;'>"+ childData.name +"</div>" + 
                                         "<div style='position: absolute; left: 50px; bottom: 50px;'>**** **** **** "+ childData.last4 +"</div>" +
                                         "<img src='"+url+"' style='position: absolute; right: 20px; bottom: 30px; width: 70px;height: 55px;'>" +
                                         "</div>" + 
                                         "</div>");

          }

          bander = bander + 1

        });
    });
    
  
    $('#back').click(function(e){
        e.preventDefault();
        $("#container").empty().load('listadoPagos/listadoPagos.html');
        $.getScript("listadoPagos/lib/listadoPagos.js");
        return false;
    });

    $("#formCard").submit(function(e) {
        e.preventDefault();
        $('#modalCard').modal('hide')
        var tokenParams = {
            "card": {
              "number": $("#cc_numcard").val(),
              "name": $("#cc_name").val(),
              "exp_year": $("#cc_exp_yr").val(),
              "exp_month": $("#cc_exp_mo").val(),
              "cvc": $("#cvv").val()
            }
        };
        $.showLoading();
        Conekta.Token.create(tokenParams, conektaSuccessResponseHandler, conektaErrorResponseHandler);
    });

  

});