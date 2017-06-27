const baseCost = 2500

let pageindex = 1

$('.next-button').click(function() {
	$('#order-step'+pageindex).fadeOut()
	pageindex++
	$('#order-step'+pageindex).fadeIn()
})
$('.back-button').click(function() {
	$('#order-step'+pageindex).fadeOut()
	pageindex--
	$('#order-step'+pageindex).fadeIn()
})

