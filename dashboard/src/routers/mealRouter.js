const router = require('express').Router()

router.get('/date/:date/flight/:flightCode', (req, res, next) => {
  const { date, flightCode}  = req.params

  res.send(`Meal data for flight ${flightCode} on ${date}`)
})

module.exports = router