// const sc1BlockReward = 20000000 // SC per day on end of june 2018
// const dcr1BlockReward = 3570 // DCR per day on end of june 2018
// let obelisks = 1
// let electricityPrice = 0.1

// const sc1SellCap = 4000

// const dcr1SellCap = 4000

// // monthlyRevenue returns the estimated monthly revenue given the number of
// // obelisks and the number of obelisks sold
// const monthlySC1Revenue = function(obelisks) {
//   return obelisks / sc1SellCap * sc1BlockReward * 30
// }
// const monthlyDCR1Revenue = function(obelisks) {
//   return obelisks / dcr1SellCap * dcr1BlockReward * 30
// }

// // monthlyElectricityCost returns the estimated monthly electricity cost given
// // the cost of electricity per KW/H
// const monthlyElectricityCost = function(obelisks, electricityPrice) {
//   return obelisks * electricityPrice * (500 / 1000) * 24 * 30
// }

// const updateProfitFields = function() {
//   $('#electricity-cost-result').text(Math.round(monthlyElectricityCost(obelisks, electricityPrice)))
//   $('#sc1-mining-reward-result').text(Math.round(monthlySC1Revenue(obelisks)).toLocaleString())
//   $('#dcr1-mining-reward-result').text(Math.round(monthlyDCR1Revenue(obelisks)).toLocaleString())
// }

// $('#quantity-input').on('input', function(e) {
//   if (isNaN(parseInt(e.target.value, 10))) {
//     return
//   }
//   obelisks = parseInt(e.target.value, 10)
//   updateProfitFields()
// })

// $('#electricity-cost').on('input', function(e) {
//   if (isNaN(parseFloat(e.target.value))) {
//     return
//   }
//   electricityPrice = parseFloat(e.target.value)
//   updateProfitFields()
// })

// updateProfitFields()

const formatNumber = function(n) {
  return n.toLocaleString(n)
}

const dcr1Sold = 2479
const sc1Sold = 2458

$('#sc1-sold').text(formatNumber(sc1Sold))
$('#dcr1-sold').text(formatNumber(dcr1Sold))

// Feb. 1, 8:00AM GMT is January 31, midnight Pacific Time
// NOTE: Month is ZERO BASED here!
var saleEndTime = Date.UTC(2018, 1, 1, 8, 0, 0)
var isSaleOver = false

var MS_PER_SEC = 1000
var MS_PER_MIN = MS_PER_SEC * 60
var MS_PER_HOUR = MS_PER_MIN * 60
var MS_PER_DAY = MS_PER_HOUR * 24

// Countdown timer
var updatePresaleTimer = function() {
  var currTime = new Date()
  var timeRemaining = saleEndTime - currTime.getTime()
  if (timeRemaining <= 0) {
    $('#countdown-timer').text('SALE OVER')
    $('#countdown-container').css('width', '230px')
    $('.hide-when-sale-closed').css('visibility', 'hidden')
    $('.disp-when-sale-closed').css('display', 'block')
    $('.no-disp-when-sale-closed').css('display', 'none')
    clearInterval(interval)
    return
  }

  var days = Math.floor(timeRemaining / MS_PER_DAY)
  timeRemaining -= days * MS_PER_DAY

  var hours = Math.floor(timeRemaining / MS_PER_HOUR)
  timeRemaining -= hours * MS_PER_HOUR

  var mins = Math.floor(timeRemaining / MS_PER_MIN)
  timeRemaining -= mins * MS_PER_MIN

  var secs = Math.floor(timeRemaining / MS_PER_SEC)

  daysStr = days < 10 ? '0' + days : days
  hoursStr = hours < 10 ? '0' + hours : hours
  minsStr = mins < 10 ? '0' + mins : mins
  secsStr = secs < 10 ? '0' + secs : secs

  $('.countdown-dd').text(daysStr)
  $('.countdown-hh').text(hoursStr)
  $('.countdown-mm').text(minsStr)
  $('.countdown-ss').text(secsStr)
}

var interval = setInterval(updatePresaleTimer, 1000)

updatePresaleTimer()
