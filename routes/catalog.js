'use strict'
const express = require('express')
const router = express.Router()

// Require controller modules.
const bookController = require('../controllers/bookController')

/// Book ROUTES ///

// GET catalog home page.
router.get('/', bookController.index)

// GET request for add a book
router.get('/book/add', bookController.addBookForm)

// POST request to add a book
router.post('/book/add', bookController.addBookPost)

// GET Book List
router.get('/book/list', bookController.bookList)

// GET request to specific book
router.get('/book/:id', bookController.bookDetail)

// GET request to delete book
router.get('/book/:id/delete', bookController.deleteBookGet)

// POST request to delete book
router.post('/book/:id/delete', bookController.deleteBookPost)

// GET request to update book
router.get('/book/:id/update', bookController.updateBookGet)

module.exports = router
