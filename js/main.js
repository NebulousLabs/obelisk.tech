const sc1BlockReward = 20000000 // SC per day on end of june 2018
const dcr1BlockReward = 3570 // DCR per day on end of june 2018
let obelisks = 1
let electricityPrice = 0.1

const sc1Sold = 3479
const sc1SellCap = 4000

const dcr1Sold = 2763
const dcr1SellCap = 4000

// monthlyRevenue returns the estimated monthly revenue given the number of
// obelisks and the number of obelisks sold
const monthlySC1Revenue = function(obelisks) {
  return obelisks / sc1SellCap * sc1BlockReward * 30
}
const monthlyDCR1Revenue = function(obelisks) {
  return obelisks / dcr1SellCap * dcr1BlockReward * 30
}

// monthlyElectricityCost returns the estimated monthly electricity cost given
// the cost of electricity per KW/H
const monthlyElectricityCost = function(obelisks, electricityPrice) {
  return obelisks * electricityPrice * (500 / 1000) * 24 * 30
}

const updateProfitFields = function() {
  $('#electricity-cost-result').text(Math.round(monthlyElectricityCost(obelisks, electricityPrice)))
  $('#sc1-mining-reward-result').text(Math.round(monthlySC1Revenue(obelisks)).toLocaleString())
  $('#dcr1-mining-reward-result').text(Math.round(monthlyDCR1Revenue(obelisks)).toLocaleString())
}

$('#quantity-input').on('input', function(e) {
  if (isNaN(parseInt(e.target.value, 10))) {
    return
  }
  obelisks = parseInt(e.target.value, 10)
  updateProfitFields()
})

$('#electricity-cost').on('input', function(e) {
  if (isNaN(parseFloat(e.target.value))) {
    return
  }
  electricityPrice = parseFloat(e.target.value)
  updateProfitFields()
})

updateProfitFields()

const formatNumber = function(n) {
  return n.toLocaleString(n)
}

$('.order-bar-sc1-inner').css('width', sc1Sold / sc1SellCap * 100 + '%')
$('#sc1-sold').text(formatNumber(sc1Sold))
$('#sc1-sell-cap').text(formatNumber(sc1SellCap))

$('.order-bar-dcr1-inner').css('width', dcr1Sold / dcr1SellCap * 100 + '%')
$('#dcr1-sold').text(formatNumber(dcr1Sold))
$('#dcr1-sell-cap').text(formatNumber(dcr1SellCap))

var saleEndTime = Date.UTC(2017, 10, 25, 5, 0, 0)
var isSaleOver = false

var MS_PER_SEC = 1000
var MS_PER_MIN = MS_PER_SEC * 60
var MS_PER_HOUR = MS_PER_MIN * 60

// Countdown timer
var updatePresaleTimer = function() {
  var currTime = new Date()
  var timeRemaining = saleEndTime - currTime.getTime()
  if (timeRemaining <= 0) {
    $('#countdown-timer').text('SALE OVER')
    $('#countdown-container').css('width', '230px')
    $('.hide-when-sale-closed').css('visibility', 'hidden')
    $('.no-disp-when-sale-closed').css('display', 'none')
    clearInterval(interval)
    return
  }

  var hours = Math.floor(timeRemaining / MS_PER_HOUR)
  timeRemaining -= hours * MS_PER_HOUR

  var mins = Math.floor(timeRemaining / MS_PER_MIN)
  timeRemaining -= mins * MS_PER_MIN

  var secs = Math.floor(timeRemaining / MS_PER_SEC)
  timeRemaining -= secs * MS_PER_SEC

  var timeString = ''
  timeString += (hours < 10 ? '0' + hours : hours) + ':'
  timeString += (mins < 10 ? '0' + mins : mins) + ':'
  timeString += secs < 10 ? '0' + secs : secs

  $('#countdown-timer').text(timeString)
}

var interval = setInterval(updatePresaleTimer, 1000)

updatePresaleTimer()
