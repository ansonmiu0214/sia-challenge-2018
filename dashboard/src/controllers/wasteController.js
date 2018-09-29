const fs = require('fs')
const path = require('path')

const DATA_DIR = './../mock_data'
const DEEPLENS_DATA_DIR = './../deeplens_data'

function getWastage(req, res, next) {
  const { date, flightCode }  = req.params

  // Check whether there is wastage data
  let targetDir = path.join(DATA_DIR, date, flightCode)
  console.log(targetDir)

  // Querying this "special flight" uses data generated from the mock DeepLens script instead
  if (flightCode == 'SQ888') {
    targetDir = path.join(DEEPLENS_DATA_DIR, date, flightCode)
  }

  if (!fs.existsSync(targetDir)) return next(new Error(`No wastage data recorded for flight ${flightCode} on ${date}`))

  // Read JSONs and return result
  fsReadJSON(targetDir)
    .then(objects => res.status(200).json(objects))
    .catch(error => next(error))
}

function getWastageByDay(req, res, next) {
  const dates = [
    "Jul 1", "Jul 2", "Jul 3", "Jul 4", "Jul 5", "Jul 6", "Jul 7", "Jul 8", "Jul 9", "Jul 10",
    "Jul 11", "Jul 12", "Jul 13", "Jul 14", "Jul 15", "Jul 16", "Jul 17", "Jul 18", "Jul 19"
  ]

  const values = [
    1000, 3016, 2626, 1839, 1828, 2868, 3127, 3325, 2584, 2415, 
    3265, 3198, 3845, 2910, 1928, 2193, 1830, 1720, 1403
 ]

  res.status(200).json({
    dates: dates, 
    values: values
  })
}

function getWastageByMonth(req, res, next) {
  const dates = [
    "January", "February", "March", "April", "May", "June"
  ]
  
  const values = [
    34215, 25312, 46251, 37841, 39821, 21498
  ]

  res.status(200).json({
    dates: dates,
    values: values
  })
}

function getWastageByFood(req, res, next) {
  const foodNames = [
    "E001", "E002", "TXL166", "S001"
  ]

  const values = [
    1221, 1558, 1125, 632
  ]

  res.status(200).json({
    foodNames: foodNames,
    values: values
  })
}

function fsReadJSON(targetDir) {
  return new Promise((resolve, reject) => {
    fs.readdir(targetDir, (error, files) => {
      if (error) return reject(error)

      const objects = files.map(file => {
        const rawJSON = fs.readFileSync(path.join(targetDir, file))
        return JSON.parse(rawJSON)
      })

      resolve(objects)
    })
  })
}

module.exports = {
  getWastage: getWastage,
  getWastageByDay: getWastageByDay,
  getWastageByMonth: getWastageByMonth,
  getWastageByFood: getWastageByFood
}