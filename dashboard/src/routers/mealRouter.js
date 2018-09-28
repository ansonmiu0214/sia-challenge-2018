const router = require('express').Router()
const mealController = require('./../controllers/mealController')

router.get('/date/:date/flight/:flightCode', mealController.getMeal)

module.exports = router