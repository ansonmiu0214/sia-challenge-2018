const fs = require('fs')
const path = require('path')

const DATA_DIR = './../mock_data'

function getWastage(req, res, next) {
  const { date, flightCode}  = req.params

  // Check whether there is wastage data
  const targetDir = path.join(DATA_DIR, date, flightCode)
  console.log(targetDir)

  if (!fs.existsSync(targetDir)) return next(new Error(`No wastage data recorded for flight ${flightCode} on ${date}`))

  // Read JSONs and return result
  const dirPromise = new Promise((resolve, reject) => {
    fs.readdir(targetDir, (error, files) => {
      if (error) return reject(error)

      const objects = files.map(file => {
        const rawJSON = fs.readFileSync(path.join(targetDir, file))
        return JSON.parse(rawJSON)
      })

      resolve(objects)
    })
  })

  dirPromise.then(objects => {
    console.log(objects)
    res.status(200).json(objects)
  }).catch(error => next(error))

  // res.send(`Waste data for flight ${flightCode} on ${date}`)
}

module.exports = {
  getWastage: getWastage
}