$(document).ready(function(){

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
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;
          
            console.log("Usuario.... ", user)

        } else {
            console.log("Sin session....")
            window.location.href = 'index.html';

        }
      });


      $.ajax({
        url: "home/home.html",
        cache: false
      }).done(function( html ) {
          $("#container" ).empty().append( html );
          $.getScript("home/lib/home.js");
    });


    $("li").click(function() {
        // remove classes from all
        $("li").removeClass("active");
        // add class to the one we clicked
        $(this).addClass("active");
     });

    $("#salir").click(function() {
        
        firebase.auth().signOut().then(function() {
            window.location.href = 'index.html';
          }, function(error) {
            console.error('Sign Out Error', error);
            
        });

    });


});

