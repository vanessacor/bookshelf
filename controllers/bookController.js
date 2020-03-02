'use strict'
const Book = require('../models/book')
const Author = require('../models/author')
const Genre = require('../models/genre')

exports.index = function (req, res) {
  res.render('index')
}

// Display all the books
exports.bookList = function (req, res, next) {
  Book.find()
    .populate('author')
    .populate('genre')
    .exec()
    .then((listOfBooks) => {
      const results = { bookList: listOfBooks }
      res.render('book-list', results)
    })
    .catch((err) => {
      return next(err)
    })
}

// Display add book form on Get
exports.addBookForm = function (req, res, next) {
  const authorQuery = Author.find()
  const categoryQuery = Genre.find()

  Promise.all([authorQuery, categoryQuery])
    .then((results) => {
      const authors = results[0]
      const genres = results[1]

      const data = {
        book: undefined,
        title: 'Add a Book',
        authors: authors,
        genre: genres
      }

      res.render('book-form', data)
    })

    .catch((error) => {
      next(error)
    })
}

exports.addBookPost = function (req, res) {
  res.send('NOT IMPLEMENTED: add book form')
}
