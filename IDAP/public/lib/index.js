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



    $.ajax({
        url: "login/login.html",
        cache: false
      }).done(function( html ) {
          $("#container" ).empty().append( html );
          $.getScript("login/lib/login.js");
    });


});