const Book = require('../models/book')
const Genre = require('../models/genre')

const validator = require('express-validator')

exports.genreList = function (req, res, next) {
  Genre.find()
    .sort([['name', 'ascending']])
    .exec()
    .then((listOfGenres) => {
      const results = { genreList: listOfGenres }
      res.render('genre-list', results)
    })
    .catch((err) => {
      return next(err)
    })
}

exports.genreDetail = function (req, res, next) {
  const genre = Genre.findById(req.params.id)

  const books = Book.find({ genre: req.params.id })
    .populate('author')

  Promise.all([genre, books])
    .then((results) => {
      const genre = results[0]
      const books = results[1]
      if (!genre) {
        const err = new Error('author not found')
        err.status = 404
        return next(err)
      }
      const data = {
        genre,
        books
      }
      res.render('genre-detail', data)
    })
    .catch((error) => {
      next(error)
    })
}

exports.genreAddForm = function (req, res, next) {
  const data = {
    title: 'Add Genre',
    btnLabel: 'Add'
  }
  res.render('genre-form', data)
}

exports.genreAddPost = [
  validator.check('name', 'genre must not be empty.').isLength({ min: 1 }).trim(),

  validator.sanitizeBody('*').escape(),

  (req, res, next) => {
    const errors = validator.validationResult(req)

    const genre = new Genre({ name: req.body.name })

    if (!errors.isEmpty()) {
      res.redirect('/catalog/genre/add')
    } else {
      Genre.findById(req.params.id)
        .exec(function (err, foundGenre) {
          if (err) { return next(err) }

          if (foundGenre) {
            res.redirect(foundGenre.url)
          } else {
            genre.save(function (err) {
              if (err) { return next(err) }
              res.redirect(genre.url)
            })
          }
        })
    }
  }
]

exports.deleteGenreGet = function (req, res, next) {
  const genre = Genre.findById(req.params.id).exec()
  const books = Book.find({ genre: req.params.id }).exec()

  Promise.all([genre, books])
    .then((results) => {
      const genre = results[0]
      const books = results[1]

      if (genre === null) {
        res.redirect('/catalog/genre/list')
      }

      const data = {
        title: 'Delete Genre',
        genre: genre,
        books: books
      }
      res.render('genre-delete', data)
    })
    .catch((error) => {
      next(error)
    })
}

exports.deleteGenrePost = function (req, res, next) {
  Genre.findById(req.params.id)
    .exec()

    .then((results) => {
      const genre = results

      if (genre == null) {
        res.redirect('/catalog/genre/list')
      } else {
        Genre.findByIdAndRemove(genre, function deleteGenre (err) {
          if (err) {
            return next(err)
          }
          res.redirect('/catalog/genre/list')
        })
      }
    })
    .catch((error) => {
      next(error)
    })
}

exports.updateGenreGet = function (req, res, next) {
  Genre.findById(req.params.id).exec()

    .then((results) => {
      const genre = results
      if (genre === null) {
        res.redirect('/catalog/genre/list')
      }
      const data = {
        title: 'Update Genre',
        btnLabel: 'Update',
        genre: genre
      }
      res.render('genre-form', data)
    })

    .catch((error) => {
      next(error)
    })
}

exports.updateGenrePost = [
  validator.check('name', 'Genre must not be empty.').isLength({ min: 1 }).trim(),

  validator.sanitizeBody('*').escape(),

  (req, res, next) => {
    const errors = validator.validationResult(req)

    const genre = new Genre(
      {
        name: req.body.name,
        _id: req.params.id
      }
    )

    if (!errors.isEmpty()) {
      res.redirect('/catalog/genre/add')
    } else {
      Genre.findByIdAndUpdate(req.params.id, genre, {}, function (err, thegenre) {
        if (err) { return next(err) }
        res.redirect(thegenre.url)
      })
    }
  }

]
