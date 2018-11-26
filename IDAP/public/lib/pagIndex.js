Conekta.setPublicKey('key_AtDJLAoxDps2UFyZPbYXkyQ');

$.fn.ForceNumericOnly =
function()
{
    return this.each(function()
    {
        $(this).keydown(function(e)
        {
            var key = e.charCode || e.keyCode || 0;
            return (
                key == 8 || 
                key == 9 ||
                key == 13 ||
                key == 46 ||
                key == 110 ||
                key == 190 ||
                (key >= 35 && key <= 40) ||
                (key >= 48 && key <= 57) ||
                (key >= 96 && key <= 105));
        });
    });
};

$(document).ready(function(){

    var displayName;
    var email;
    var emailVerified;
    var photoURL;
    var isAnonymous;
    var uid;
    var providerData;
    var tok;
    var idConektaWeb;
    var jsonPayment;


    firebase.storage().ref('images/bg-image-short.png').getDownloadURL().then(function(url) {
        // Insert url into an <img> tag to "download"
        //console.log("0")
        $('body').css({ 'background-image': "url(" + url + ")",
                        'background-repeat': "no-repeat",
                        'background-position':"left center",
                        'background-attachment':"fixed",
                        'background-size': "contain, cover" });
    }).catch(function(error) {

      switch (error.code) {
        case 'storage/object-not-found':
        // File doesn't exist
        //console.log("1")
        break;
        case 'storage/unauthorized':
        // User doesn't have permission to access the object
        //console.log("2")
        break;
        case 'storage/canceled':
        // User canceled the upload
        //console.log("3")
        break;
        case 'storage/unknown':
        //console.log("4")
        // Unknown error occurred, inspect the server response
        break;
      }

    });

    $.showLoading = function showLoading() {
        $('body').loadingModal({
            position: 'auto',
            text: '',
            color: '#fff',
            opacity: '0.7',
            backgroundColor: 'rgb(0,0,0)',
            animation: 'circle'  
         });
    }

    $.hideLoading = function hideLoading() {
        $('body').loadingModal('hide');
        $('body').loadingModal('destroy');
    }

    $.getUID = function getUID() {
        return uid
    }
    $.getTok = function getTok() {
        return tok
    }
    $.getTokConekta = function getTokConekta() {
        return idConektaWeb
    }
    $.setJsonPayment = function setJsonPayment(obj) {
        jsonPayment = obj
    }
    $.getJsonPayment = function getJsonPayment() {
        return jsonPayment
    }

    try {
        let app = firebase.app();
        let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
        document.getElementById('load').innerHTML = `Firebase SDK loaded with ${features.join(', ')}`;
        } catch (e) {
        console.error(e);
        document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
    }


    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          displayName = user.displayName;
          email = user.email;
          emailVerified = user.emailVerified;
          photoURL = user.photoURL;
          isAnonymous = user.isAnonymous;
          uid = user.uid;
          providerData = user.providerData;
          user.getIdToken(/* forceRefresh */ true).then(function(idToken) {
            tok = idToken;
            registraUsuarioConekta();
            
            console.log(tok);
            $.ajax({
                url: "listadoPagos/listadoPagos.html",
                cache: false
            }).done(function( html ) {
                  $("#container" ).empty().append( html );
                  $.getScript("listadoPagos/lib/listadoPagos.js");
            });

          }).catch(function(error) {
            // Handle error
          });
        } else {
            window.location.href = 'index.html';
        }
      });

    $("li").click(function() {
        $("li").removeClass("active");
        $(this).addClass("active");
        switch($(this).text().trim()) {
            case "Pagos":
                $.ajax({
                    url: "listadoPagos/listadoPagos.html",
                    cache: false
                  }).done(function( html ) {
                      $("#container" ).empty().append( html );
                      $.getScript("listadoPagos/lib/listadoPagos.js");
                });
            break;
            case "Facturas":
                $.ajax({
                    url: "listadoFacturas/listadoFacturas.html",
                    cache: false
                }).done(function( html ) {
                  $("#container" ).empty().append( html );
                  $.getScript("listadoFacturas/lib/listadoFacturas.js");
                });
                break;
            case "Mi cuenta":
                $.ajax({
                    url: "perfil/perfil.html",
                    cache: false
                }).done(function( html ) {
                    $("#container" ).empty().append( html );
                    $.getScript("perfil/lib/perfil.js");
                });
                break;
            default:
                console.log("Not controller");
        } 

     });

    $("#salir").click(function() {
        
        firebase.auth().signOut().then(function() {
            window.location.href = 'index.html';
          }, function(error) {
            console.error('Sign Out Error', error);

        });

    });

    function registraUsuarioConekta(){
        var starCountRef = firebase.database().ref('users/' + uid + '/idConekta');
        starCountRef.once('value', function(snapshot) {
            if (snapshot.exists()){
                idConektaWeb = snapshot.val();
            }else{
                $.showLoading()
                $.ajax ( {
                    url: "http://localhost:5001/idap-9501d/us-central1/createUserConekta",
                    method: "POST",
                    dataType: "json",
                    crossDomain: true,
                    contentType: "application/json; charset=utf-8",
                    data: null,
                    cache: false,
                    headers: {
                        "x-user-key": tok
                    },
                    async: true,
                    success: function(datos){
                        $.hideLoading();
                        idConektaWeb = datos.id;
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        $.hideLoading()
                        toastr.error('Algo salio mal favor de intentarlo mas tarde', 'UPSS!');
                    }
                });
            }
        });
    
    }

});

