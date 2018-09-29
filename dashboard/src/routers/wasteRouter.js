const router = require('express').Router()
const wasteController = require('./../controllers/wasteController')

router.get('/date/:date/flight/:flightCode' , wasteController.getWastage)
router.get('/days'                          , wasteController.getWastageByDay)
router.get('/months'                        , wasteController.getWastageByMonth)
router.get('/byFood'                        , wasteController.getWastageByFood)


module.exports = router