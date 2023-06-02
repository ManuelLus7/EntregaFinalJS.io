		
$(function(){

	$('header ul.lang a.lang-es').addClass('active');

	$('#cwin-sidebar .toggle').css({'right':'0'});
	$('#cwin-sidebar .sidebar-content').css({'right':'-100%'});

	$('#cwin-sidebar .toggle').click(function()
    {
	    $(this).animate({'right':'-100%'},'slow','easeInOutCubic',function()
        {
	        $('#cwin-sidebar .sidebar-content').animate({'right':'0'},'slow','easeInOutCubic');
	
        });
		return false;
	});

	$('#cwin-sidebar .btn-close').click(function()
    {
	         $('#cwin-sidebar .sidebar-content').animate({'right':'-100%'},'normal','easeInOutCubic',function()
        {
	        $('#cwin-sidebar .toggle').animate({'right':'0'},'fast','easeInOutCubic');
	
        });
		return false;
	});

});
