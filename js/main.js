const expectedHashrate = 100 // GH/s
const expectedPowerConsumption = 500 // W
const sc1BlockReward = 20000000 // SC per day on end of june 2018
const dcr1BlockReward = 4000 // SC per day on end of june 2018
let obelisks = 1
let electricityPrice = 0.1

const sellCap = 4000
const nSiaSold = 2010
const nDecredSold = 200

// monthlyRevenue returns the estimated monthly revenue given the number of
// obelisks and the number of obelisks sold
const monthlySC1Revenue = obelisks => obelisks / sellCap * sc1BlockReward * 30
const monthlyDCR1Revenue = obelisks => obelisks / sellCap * dcr1BlockReward * 30

// monthlyElectricityCost returns the estimated monthly electricity cost given
// the cost of electricity per KW/H
const monthlyElectricityCost = (obelisks, electricityPrice) =>
  obelisks * electricityPrice * (500 / 1000) * 24 * 30

const updateProfitFields = () => {
  $('#electricity-cost-result').text(Math.round(monthlyElectricityCost(obelisks, electricityPrice)))
  $('#sc1-mining-reward-result').text(Math.round(monthlySC1Revenue(obelisks)).toLocaleString())
  $('#dcr1-mining-reward-result').text(Math.round(monthlyDCR1Revenue(obelisks)).toLocaleString())
}

$('#quantity-input').on('input', e => {
  if (isNaN(parseInt(e.target.value, 10))) {
    return
  }
  obelisks = parseInt(e.target.value, 10)
  updateProfitFields()
})

$('#electricity-cost').on('input', e => {
  if (isNaN(parseFloat(e.target.value))) {
    return
  }
  electricityPrice = parseFloat(e.target.value)
  updateProfitFields()
})

updateProfitFields()

$('.order-bar-sia-inner').css('width', nSiaSold / sellCap * 100 + '%')
$('#siasold').text(nSiaSold)
$('#sellcap').text(sellCap)

$('.order-bar-decred-inner').css('width', nDecredSold / sellCap * 100 + '%')
$('#decredsold').text(nDecredSold)
$('#sellcap').text(sellCap)
