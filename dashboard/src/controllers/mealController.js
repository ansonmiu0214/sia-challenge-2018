const rp = require('request-promise')

function getMeal(req, res, next) {
  const { date, flightCode}  = req.params

  const postOptions = {
    uri: 'https://apigw.singaporeair.com/appchallenge/api/meal/upliftplan',
    method: 'POST' ,
    headers: {
      'Content-Type': 'application/json',
      'apikey': 'aghk73f4x5haxeby7z24d2rc'
    },
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

module.exports = {
  getMeal: getMeal
}