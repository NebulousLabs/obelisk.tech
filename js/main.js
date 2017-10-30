const expectedHashrate = 100 // GH/s
const expectedPowerConsumption = 500 // W
const blockReward = 20000000 // SC per day on end of june 2018
let obelisks = 1
const sellCap = 4000
const nSiaSold = 2010
const nDecredSold = 200
let electricityprice = 0.1

// monthlyRevenue returns the estimated monthly revenue given the number of
// obelisks and the number of obelisks sold
const monthlyRevenue = obelisks => obelisks / sellCap * blockReward * 30

// monthlyElectricityCost returns the estimated monthly electricty cost given
// the cost of electricity per KW/H
const monthlyElectricityCost = (obelisks, electricityprice) =>
  obelisks * electricityprice * (500 / 1000) * 24 * 30
const updateCosts = () => {
  $('#electricity-cost-result').text(Math.round(monthlyElectricityCost(obelisks, electricityprice)))
  $('#mining-reward-result').text(Math.round(monthlyRevenue(obelisks)).toLocaleString())
}

$('#quantity-input').on('input', e => {
  if (isNaN(parseInt(e.target.value, 10))) {
    return
  }
  obelisks = parseInt(e.target.value, 10)
  updateCosts()
})
$('#electricity-cost').on('input', e => {
  if (isNaN(parseFloat(e.target.value))) {
    return
  }
  electricityprice = parseFloat(e.target.value)
  updateCosts()
})

$('.order-bar-sia-inner').css('width', nSiaSold / sellCap * 100 + '%')
$('#siasold').text(nSiaSold)
$('#sellcap').text(sellCap)

$('.order-bar-decred-inner').css('width', nDecredSold / sellCap * 100 + '%')
$('#decredsold').text(nDecredSold)
$('#sellcap').text(sellCap)
