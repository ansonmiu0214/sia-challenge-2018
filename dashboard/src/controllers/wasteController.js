function getWastage(req, res, next) {
  const { date, flightCode}  = req.params

  res.send(`Waste data for flight ${flightCode} on ${date}`)
}

module.exports = {
  getWastage: getWastage
}