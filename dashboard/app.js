const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const path = require('path')
const rp = require('request-promise')

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
  const { flightCode } = req.params

  // Handle special case for "DeepLens" flight
  if (flightCode == 'SQ888') 
    return res.status(200).json({
      from: 'SIN',
      to: 'KUL'
    })


  const MEAL_API_ENDPOINT = 'https://apigw.singaporeair.com/appchallenge/api/meal/upliftplan'
  const MEAL_API_HEADERS = {
    'Content-Type': 'application/json',
    'apikey': 'aghk73f4x5haxeby7z24d2rc'
  }

  const postOptions = {
    uri: MEAL_API_ENDPOINT,
    method: 'POST' ,
    headers: MEAL_API_HEADERS,
    body: {
      flightNo: flightCode,
      flightDate: '2018-07-20'
    },
    json: true
  }

  rp(postOptions)
    .then(parsedBody => {
      const { sector } = parsedBody.response
      const [from, to] = sector.split('/')
      res.status(200).json({
        from: from,
        to: to
      })
    })
    .catch(error => next(error))
})

app.get('/api/flight/:flightCode', (req, res, next) => {
  const flightCode = req.params.flightCode
  res.send(`Request to get food data for flight code ${flightCode}`)
})

app.get('/_health', (req, res, next) => res.send('OK'))

// Static routes
app.use('/index', express.static(path.join(__dirname, 'public/index.html')))
app.use('/', express.static(path.join(__dirname, 'public/')))

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