const sc1BlockReward = 20000000 // SC per day on end of june 2018
const dcr1BlockReward = 3570 // DCR per day on end of june 2018
let obelisks = 1
let electricityPrice = 0.1

const sc1Sold = 2090
const sc1SellCap = 4000

const dcr1Sold = 30
const dcr1SellCap = 4000

// monthlyRevenue returns the estimated monthly revenue given the number of
// obelisks and the number of obelisks sold
const monthlySC1Revenue = obelisks => obelisks / sc1SellCap * sc1BlockReward * 30
const monthlyDCR1Revenue = obelisks => obelisks / dcr1SellCap * dcr1BlockReward * 30

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

const formatNumber = n => n.toLocaleString(n)

$('.order-bar-sc1-inner').css('width', sc1Sold / sc1SellCap * 100 + '%')
$('#sc1-sold').text(formatNumber(sc1Sold))
$('#sc1-sell-cap').text(formatNumber(sc1SellCap))

$('.order-bar-dcr1-inner').css('width', dcr1Sold / dcr1SellCap * 100 + '%')
$('#dcr1-sold').text(formatNumber(dcr1Sold))
$('#dcr1-sell-cap').text(formatNumber(dcr1SellCap))
