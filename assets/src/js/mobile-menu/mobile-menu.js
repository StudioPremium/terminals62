$(document).ready(function() {
	$(function() {
		function openMenu() {
			$('body').addClass('body_menu-open');
	 		$('#mobile-menu').addClass('open');
	 		$('.navbar-toggler').addClass('open');
	    	transferNavInMobile();
 			createBodyOverlay();
		};

		function closeMenu() {
			$('body').removeClass('body_menu-open');
	 		$('#mobile-menu').removeClass('open');
	 		$('.navbar-toggler').removeClass('open');
	    	transferNavFromMobile();
	    	removeBodyOverlay();
		};

		function transferNavInMobile() {
			var mainNav = $('#main-nav');
			$('#mobile-menu-nav').append(mainNav);
		};

		function transferNavFromMobile() {
			var mainNav = $('#main-nav');
			$('#navbarNavDropdown').append(mainNav);
		};

		function createBodyOverlay() {
			$('body').prepend('<div id="body-overlay" class="body-overlay"></div>');
			setTimeout(function () {
				$('#body-overlay').addClass('body-overlay_done');
			}, 500); 
			$('#body-overlay').click(function(e) {
	 			closeMenu();
	 		});
		};

		function removeBodyOverlay() {
			$('#body-overlay').removeClass('body-overlay_done');
	    	setTimeout(function () {
				$('#body-overlay').remove();
			}, 500); 
		};

	 	$('.navbar-toggler').click(function(e) {
	 		e.preventDefault();
	 		if ($('.navbar-toggler').hasClass('open')) {
	 			closeMenu();
	    	} else {
	    		openMenu();
	    	};
	 	});
	 	
	});
});
