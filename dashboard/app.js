const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const path = require('path')

const mealRouter = require('./src/routers/mealRouter')
const wasteRouter = require('./src/routers/wasteRouter')

const app = express()

// Middleware
app.use(logger('dev'))
app.use(bodyParser.json({ limit: '500kb' }))
app.use(bodyParser.urlencoded({ extended: true }))

// API routes
app.use('/api/meal', mealRouter)
app.use('/api/waste', wasteRouter)

app.get('/api/flight/:flightCode', (req, res, next) => {
  const flightCode = req.params.flightCode
  res.send(`Request to get food data for flight code ${flightCode}`)
})

app.get('/_health', (req, res, next) => res.send('OK'))

// Static routes
app.use('/index', express.static(path.join(__dirname, 'public')))
app.use('/', express.static(path.join(__dirname, 'public')))

// Error handler
app.use((req, res, next) => {
  const error = new Error('Not Found')
  error.statusCode = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    success: false,
    errorMessage: error.message
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`))