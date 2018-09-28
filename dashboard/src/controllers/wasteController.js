const fs = require('fs')
const path = require('path')

const DATA_DIR = './../mock_data'
const DEEPLENS_DATA_DIR = './../deeplens_data'

function getWastage(req, res, next) {
  const { date, flightCode}  = req.params

  // Check whether there is wastage data
  let targetDir = path.join(DATA_DIR, date, flightCode)
  console.log(targetDir)

  // Querying this "special flight" uses data generated from the mock DeepLens script instead
  if (date == '2018-07-21' && flightCode == 'SQ888') {
    targetDir = path.join(DEEPLENS_DATA_DIR, date, flightCode)
  }

  if (!fs.existsSync(targetDir)) return next(new Error(`No wastage data recorded for flight ${flightCode} on ${date}`))

  // Read JSONs and return result
  fsReadJSON(targetDir).then(objects => {
    console.log(objects)
    res.status(200).json(objects)
  }).catch(error => next(error))

  // res.send(`Waste data for flight ${flightCode} on ${date}`)
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
  getWastage: getWastage
}