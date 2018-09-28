const router = require('express').Router()
const wasteController = require('./../controllers/wasteController')

router.get('/date/:date/flight/:flightCode', wasteController.getWastage)

module.exports = router