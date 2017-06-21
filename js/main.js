const second = 1000
const minute = second * 60
const hour = minute * 60
const day = hour * 24

const releaseDate = new Date(2017, 5, 29)
const timeLeft = releaseDate - new Date()

const daysLeft = Math.floor(timeLeft / day).toString()
const hoursLeft = Math.floor((timeLeft % day) / hour).toString()
const minutesLeft = Math.floor((timeLeft % hour) / minute).toString()

document.getElementById('daysleft-tens').innerHTML = Math.floor(daysLeft / 10 % 10)
document.getElementById('daysleft').innerHTML = daysLeft % 10
document.getElementById('hoursleft-tens').innerHTML = Math.floor(hoursLeft / 10 % 10)
document.getElementById('hoursleft-ones').innerHTML = hoursLeft % 10
document.getElementById('minutesleft-tens').innerHTML = Math.floor(minutesLeft / 10 % 10)
document.getElementById('minutesleft-ones').innerHTML = minutesLeft % 10


