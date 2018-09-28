function getMeal(req, res, next) {
  const { date, flightCode}  = req.params

  res.send(`Meal data for flight ${flightCode} on ${date}`)
}

module.exports = {
  getMeal: getMeal
}