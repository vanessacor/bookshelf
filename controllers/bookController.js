'use strict'
const Book = require('../models/book')
const Author = require('../models/author')
const Genre = require('../models/genre')

const validator = require('express-validator')

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

exports.bookDetail = function (req, res, next) {
  Book.findById(req.params.id)
    .populate('author')
    .populate('genre')
    .exec()
    .then((book) => {
      if (!book) { // No results.
        var err = new Error('book not found')
        err.status = 404
        return next(err)
      }
      // Successful, so render.
      const data = {
        title: book.title,
        book: book
      }
      res.render('book-detail', data)
    })
    .catch((err) => {
      next(err)
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
        btnLabel: 'Add',
        authors: authors,
        genres: genres
      }

      res.render('book-form', data)
    })

    .catch((error) => {
      next(error)
    })
}

exports.addBookPost = [

  // Validate fields.
  validator.check('title', 'title must not be empty.').isLength({ min: 1 }).trim(),
  validator.check('author', 'Author must not be empty.').isLength({ min: 1 }).trim(),
  validator.check('genre', 'Genre must not be empty.').isLength({ min: 1 }).trim(),
  validator.check('status', 'Status must be selected.').isLength({ min: 1 }).trim(),
  validator.check('summary', 'Summary must not be empty').isLength({ min: 1 }).trim(),
  validator.check('isbn', 'isbn must not be empty').isLength({ min: 1 }).trim(),

  // Sanitize fields (using wildcard).
  validator.sanitizeBody('*').escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validator.validationResult(req)

    // Create a Book object with escaped and trimmed data.
    const book = new Book(
      {
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        status: req.body.status,
        summary: req.body.summary,
        isbn: req.body.isbn
      })

    if (!errors.isEmpty()) {
      console.log('error', errors)
      res.redirect('/catalog/book/add')
    } else {
      // Data from form is valid. Save product.
      book.save(function (err) {
        if (err) {
          console.log('err', err)
          return next(err)
        }
        // successful - redirect to new product record.
        console.log('new book', book.url)
        res.redirect(book.url)
      })
    }
  }
]

// display delete book on Get
exports.deleteBookGet = function (req, res, next) {
  Book.findById(req.params.id)
    .exec()

    .then((results) => {
      const books = results

      if (books == null) { // No results.
        res.redirect('/catalog/book')
      }

      const data = {
        title: 'Delete Book',
        book: books
      }
      res.render('book-delete', data)
    })
    .catch((error) => {
      next(error)
    })
}

exports.deleteBookPost = function (req, res, next) {
  Book.findById(req.params.id)
    .exec()

    .then((results) => {
      const book = results

      if (book == null) { // No results.
        res.redirect('/catalog/book')
      } else {
        Book.findByIdAndRemove(book, function deleteBook (err) {
          if (err) {
            return next(err)
          }
          res.redirect('/catalog/book/list')
        })
      }
    })
    .catch((error) => {
      next(error)
    })
}

exports.updateBookGet = function (req, res, next) {
  const book = Book.findById(req.params.id)
    .populate('author')
    .populate('genre')

  const authors = Author.find()

  const genres = Genre.find()

  Promise.all([book, authors, genres])
    .then((results) => {
      const book = results[0]
      const authors = results[1]
      const genres = results[2]
      if (!book) { // No results.
        var err = new Error('book not found')
        err.status = 404
        return next(err)
      }
      // Successful, so render.
      const data = {
        btnLabel: 'Update',
        title: book.title,
        book,
        authors,
        genres
      }
      res.render('book-form', data)
    })
}

exports.updateBookPost = [
  // Validate fields.
  validator.check('title', 'title must not be empty.').isLength({ min: 1 }).trim(),
  validator.check('author', 'Author must not be empty.').isLength({ min: 1 }).trim(),
  validator.check('genre', 'Genre must not be empty.').isLength({ min: 1 }).trim(),
  validator.check('status', 'Status must be selected.').isLength({ min: 1 }).trim(),
  validator.check('summary', 'Summary must not be empty').isLength({ min: 1 }).trim(),
  validator.check('isbn', 'isbn must not be empty').isLength({ min: 1 }).trim(),

  // Sanitize fields (using wildcard).
  validator.sanitizeBody('*').escape(),

  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validator.validationResult(req)

    const book = new Book(
      {
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        status: req.body.status,
        summary: req.body.summary,
        isbn: req.body.isbn,
        _id: req.params.id
      })

    if (!errors.isEmpty()) {
      console.log('error', errors)
      res.redirect('/catalog/book/list')
    } else {
      // Data from form is valid. Save product.

      Book.findByIdAndUpdate(req.params.id, book, {}, function (err, thebook) {
        if (err) { return next(err) }
        // Successful - redirect to book detail page.
        res.redirect(thebook.url)
      })
    }
  }
]
