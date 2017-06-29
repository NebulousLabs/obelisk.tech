function setActiveTab(tabname) {
	$(".nav-item").each(function(i, item) {
		$(item).removeClass('active')
	})
	$(tabname).addClass('active')
}

function updateNav() {
	const pos = $(window).scrollTop()
	if (pos >= $('#contact').offset().top) {
		console.log('aaa')
		setActiveTab('#contact-button')
	} else
	if (pos >= $('#info').offset().top){
		setActiveTab('#info-button')
	} else
	if (pos >= $('#about').offset().top) {
		setActiveTab('#about-button')
	}
}

window.onscroll = updateNav
updateNav()


