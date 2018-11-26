$(document).ready(function(){

    firebase.storage().ref('images/logo.jpg').getDownloadURL().then(function(url) {
        $("#logoimg").attr("src", url);
    }).catch(function(error) {
      switch (error.code) {
        case 'storage/object-not-found':
        // File doesn't exist
        break;
        case 'storage/unauthorized':
        // User doesn't have permission to access the object
        break;
        case 'storage/canceled':
        // User canceled the upload
        break;
        case 'storage/unknown':
        // Unknown error occurred, inspect the server response
        break;
      }
    });

    $("#login").click(function(e) {
        e.preventDefault();
        $("#container").empty().load('login/login.html');
        $.getScript("login/lib/login.js");
        return false;
    });

    $("#signup_form").submit(function(e) {

        if ($("#password").val() != $("#password_confirmation").val()){
            toastr.error('Las contraseñas deben ser iguales', '');
        }else if ($("#termConditions").is(':checked') == false){
            toastr.error('Debes aceptar los terminos y condiciones', '');
        }else{
            $.showLoading()
            firebase.auth().createUserWithEmailAndPassword($("#email").val(), $("#password").val()).then(function(user) {
                var user = firebase.auth().currentUser;
                user.sendEmailVerification().then(function(){
                    var name = $("#first_name").val() + $("#last_name").val();
                    user.updateProfile({
                        displayName: name
                      }).then(function() {
                          writeUserData(user.uid, name, $("#email").val())
                      }, function(error) {
                          writeUserData(user.uid, name, $("#email").val()) 
                    });
                });
            }, function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                toastr.error(errorMessage, errorCode);
                
            });
           
        }
        
        e.preventDefault(); // avoid to execute the actual submit of the form.
  });
    
  function writeUserData(userId, name, email) {
        
        var database = firebase.database();
        database.ref('users/'+userId).set({
          username: name,
          email: email
        }, function(error) {
            if (error) {
              $.hideLoading()
              console.log("Error ", error);
            } else {
                $.hideLoading()
                $("#signup").hide();
                toastr.success('Verifica tu email e inicia sesion', 'Registro exitoso');
            }
        });

    }
});