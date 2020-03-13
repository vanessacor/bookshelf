'use strict'
const express = require('express')
const router = express.Router()

// Require controller modules.
const bookController = require('../controllers/bookController')
const authorController = require('../controllers/authorController')

/// Book ROUTES ///

// GET catalog home page.
router.get('/', bookController.index)

router.get('/book/add', bookController.addBookForm)

router.post('/book/add', bookController.addBookPost)

router.get('/book/list', bookController.bookList)

router.get('/book/:id', bookController.bookDetail)

router.get('/book/:id/delete', bookController.deleteBookGet)

router.post('/book/:id/delete', bookController.deleteBookPost)

router.get('/book/:id/update', bookController.updateBookGet)

router.post('/book/:id/update', bookController.updateBookPost)

/// Author ROUTES ///
router.get('/author/add', authorController.authorAddForm)

router.post('/author/add', authorController.authorAddPost)

router.get('/author/list', authorController.authorList)

router.get('/author/:id', authorController.authorDetail)

// router.get('/author/:id/delete', authorController.deleteAuthorGet)

// router.post('/author/:id/delete', authorController.deleteAuthorPost)

// router.get('/author/:id/update', authorController.updateAuthorGet)

// router.post('/author/:id/update', authorController.updateAuthorPost)

module.exports = router
