
const expectedHashrate = 100 // GH/s
const expectedPowerConsumption = 500 // W
const blockReward = 20000000 // SC per day on end of june 2018

// monthlyRevenue returns the estimated monthly revenue given the number of
// obelisks and the number of obelisks sold
const monthlyRevenue = (obelisks, sold) => (obelisks / sold) * blockReward * 30

// monthlyElectricityCost returns the estimated monthly electricty cost given
// the cost of electricity per KW/H
const monthlyElectricityCost = (obelisks, electricityprice) => (obelisks*electricityprice) * (500 / 1000) * 24 * 30
let obelisks = 1
let sold = 10000
let electricityprice = 0.10
const updateCosts = () => {
	console.log(monthlyElectricityCost(obelisks, electricityprice))
	$('#electricity-cost-result').text(Math.floor(monthlyElectricityCost(obelisks, electricityprice)))
	$('#mining-reward-result').text(Math.floor(monthlyRevenue(obelisks, sold)).toLocaleString())
}

$('#quantity-input').on('input', (e) => {
	if (isNaN(parseInt(e.target.value, 10))) {
		return
	}
	obelisks = parseInt(e.target.value, 10)
	updateCosts()
})
$('#nsold-input').on('input', (e) => {
	if (isNaN(parseInt(e.target.value, 10))) {
		return
	}
	sold = parseInt(e.target.value, 10)
	updateCosts()
})
$('#electricity-cost').on('input', (e) => {
	if (isNaN(parseFloat(e.target.value))) {
		return
	}
	electricityprice = parseFloat(e.target.value)
	updateCosts()
})

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

