'use strict'
const express = require('express')
const router = express.Router()

// Require controller modules.
const bookController = require('../controllers/bookController')

/// Book ROUTES ///

// GET catalog home page.
router.get('/', bookController.index)

// GET Book List
router.get('/book/list', bookController.bookList)

// GET request for add a book
router.get('/book/add', bookController.addBookForm)

// POST request to add a book
router.post('/book/add', bookController.addBookPost)

module.exports = router
