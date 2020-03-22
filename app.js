const path = require('path')
const createError = require('http-errors')
const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const indexRouter = require('./routes/index')
const catalogRouter = require('./routes/catalog')

const app = express()

// -- db connection

const mongoDB = process.env.MONGODB_URI
mongoose.connect(mongoDB, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

// -- view engine setup

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// -- middlewares

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// -- routes

app.use('/', indexRouter)
app.use('/catalog', catalogRouter)

// -- error handlers

app.use(function (req, res, next) {
  next(createError(404))
})

app.use(function (err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render(err.status === 404 ? 'not-found' : 'error')
})

module.exports = app
