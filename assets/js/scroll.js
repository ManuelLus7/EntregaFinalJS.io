$(function(){

    $(window).scroll(function(){
        if ($(window).width()>900) {
            var value = $(this).scrollTop();
            if (value>100) {
                $('body').addClass('header-small');
            } else {
                $('body').removeClass('header-small');
            }
        }
    });
    $(window).scroll();

});