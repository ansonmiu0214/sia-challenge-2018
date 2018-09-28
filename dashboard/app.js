const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const path = require('path')

const app = express()

// Middleware
app.use(logger('dev'))
app.use(bodyParser.json({ limit: '500kb' }))
app.use(bodyParser.urlencoded({ extended: true }))

// Routes
app.use('/index', express.static(path.join(__dirname, 'public')))
app.all('*', (req, res) => res.redirect('./index'))

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