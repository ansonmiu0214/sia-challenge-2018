const rp = require('request-promise')

const MEAL_API_ENDPOINT = 'https://apigw.singaporeair.com/appchallenge/api/meal/upliftplan'
const MEAL_API_HEADERS = {
  'Content-Type': 'application/json',
  'apikey': 'aghk73f4x5haxeby7z24d2rc'
}

function getMeal(req, res, next) {
  const { date, flightCode}  = req.params

  if (date == '2018-07-21' && flightCode == 'SQ888') {
    const mockData = generateMockMeal(flightCode, date)
    return res.status(200).json(mockData)
  }

  const postOptions = {
    uri: MEAL_API_ENDPOINT,
    method: 'POST' ,
    headers: MEAL_API_HEADERS,
    body: {
      flightNo: flightCode,
      flightDate: date
    },
    json: true
  }

  rp(postOptions)
    .then(parsedBody => res.status(200).json(parsedBody.response))
    .catch(_ => next(new Error(`Meals for flight ${flightCode} on ${date} not found.`)))
}

function generateMockMeal(flightNo, flightDate) {
  return {
    flightNo: flightNo,
    flightDate, flightDate,
    sector: 'HKG/TPE',
    mealUpliftPlan: [
      {
        bookingClass: 'Economy',
        containerUpliftInformation: [
          {
            position: 'Cart 1',
            mealService: 'Snack',
            mealCode: 'S001',
            meal: 'Fruit Platter',
            quantity: '100',
            perPackWeight: '500g',
            packingColour: 'Blue'
          }
        ]
      }
    ]
  }
}

module.exports = {
  getMeal: getMeal
}