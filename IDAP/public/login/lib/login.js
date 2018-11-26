$(document).ready(function(){

    firebase.storage().ref('images/logo.jpg').getDownloadURL().then(function(url) {
        // Insert url into an <img> tag to "download"
        console.log("0")
        $("#logoimg").attr("src", url);
       
    }).catch(function(error) {

      switch (error.code) {
        case 'storage/object-not-found':
        // File doesn't exist
        console.log("1")
        break;
        case 'storage/unauthorized':
        // User doesn't have permission to access the object
        console.log("2")
        break;
        case 'storage/canceled':
        // User canceled the upload
        console.log("3")
        break;
        case 'storage/unknown':
        console.log("4")
        // Unknown error occurred, inspect the server response
        break;
      }

    });

    $("#registro").click(function(e) {
        e.preventDefault();
        $("#container").empty().load('signup/signup.html');
        $.getScript("signup/lib/signup.js");
        return false;
    });

    $("#login_Form").submit(function(e) {

        firebase.auth().signInWithEmailAndPassword($("#username").val(), $("#password").val()).then(function(user) {
        var user = firebase.auth().currentUser;
        if (user.emailVerified == false){
            toastr.error("Favor de verificar su email", '');
        }else{
            console.log("go to Login")
            window.location.href = 'pagIndex.html';

        }

        }, function(error) {
        // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            toastr.error(errorMessage, errorCode);
        
        });
        e.preventDefault();
    });

});
