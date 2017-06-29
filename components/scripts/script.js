$(function(){
	var wheight = $(window).height(); //get window height

	$('.fullheight').css('height', wheight);

	$(window).resize(function() {
		
		var wheight = $(window).height();
		$('.fullheight').css('height', wheight);
	});
});