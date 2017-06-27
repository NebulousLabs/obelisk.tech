
const baseCost = 2500
let shippingCost = 65
let tax = 0
let pageindex = 1
const totalCost = () => tax + shippingCost

$('#shippingCost').text(totalCost)

$('#country').on('input', function(e) {
	if (e.target.value === 'US' || e.target.value === 'EU' || e.target.value === 'CN') {
		shippingCost = 65
	} else {
		shippingCost = 135
	}
	$('#shippingCost').text(totalCost)
})
$('#state').on('input', function(e) {
	if (e.target.value === 'MA') {
		tax = 0.0625 * baseCost
		$('#shippingCost').text(totalCost)
	} else {
		tax = 0
	}
})
$('.next-button').click(function() {
	$('#order-step'+pageindex).hide()
	pageindex++
	$('#order-step'+pageindex).fadeIn()
})
$('.back-button').click(function() {
	$('#order-step'+pageindex).hide()
	pageindex--
	$('#order-step'+pageindex).fadeIn()
})
