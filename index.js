const { readFileSync } = require('fs')
var fs = require('fs')
const { off } = require('process')

//add days to date
function addDays(date, days) {
    var result = new Date(date)
    // console.log(result.getDate())
    result.setDate(result.getDate() + days)
    return result
}

//Check if offer date is still valid 5 day after check-in date

function checkdate(date, checkindate) {
    var validDate = addDays(checkindate, 5)
    // console.log(date)
    if (new Date(date) >= validDate) {
        return true
    }
    return false
}

//check if the categroy is Restaurant, Retail or Activity
function checkCategory(idCategory) {
    if (idCategory == 1 || idCategory == 2 || idCategory == 4) {
        return true
    }
    return false
}

//Only keep the nearest merchant in the same offer
function filterMerchants(offer) {
    let temp = []
    let min = offer.merchants[0]
    for (let i = 0; i < offer.merchants.length; i++) {
        if (offer.merchants[i].distance < min.distance) {
            min = offer.merchants[i]
        }
    }
    temp.push(min)
    offer.merchants = temp
    return offer
}


function filter1(offers) {

    //First loop to remove all non valid information
    for (let i = 0; i < offers.length; i++) {

        if (!checkCategory(offers[i].category)) {

            offers.splice(i, 1)
            i--
            continue
        }
        if (!checkdate(offers[i].valid_to, date.Date)) {
            offers.splice(i, 1)
            i--
            continue
        }
        offers[i] = filterMerchants(offers[i])
    }
    let max1 = offers[1]
    let max2 = offers[2]

    // console.log(offers)

    //find the first nearest Offer
    for (let i = 0; i < offers.length; i++) {
        if (max1.merchants[0].distance > offers[i].merchants[0].distance) {
            max1 = offers[i]
        }
    }
    //find the second nearest offer which is not the category with the first offer
    for (let i = 0; i < offers.length; i++) {
        if (offers[i].category != max1.category) {
            max2 = offers[i]
            break
        }

    }
    for (let i = 0; i < offers.length; i++) {
        if (max2.merchants[0].distance > offers[i].merchants[0].distance && offers[i].category != max1.category) {
            max2 = offers[i]
        }
    }
    let temp = []
    temp.push(max1)
    temp.push(max2)
    return temp

}


let offers = JSON.parse(readFileSync('input.json'))
let date = JSON.parse(readFileSync('CheckInDate.json'))



var result = JSON.stringify(filter(offers.offers))
fs.writeFile('output.json', result, (err) => {
    if (err) throw err
    console.log('done')
})
// console.log(offers.offers)