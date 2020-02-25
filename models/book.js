'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const BookSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
    genre: [{ type: Schema.Types.ObjectId, ref: 'Genre' }],
    status: { type: String, required: true, enum: ['Read', 'Unread'], default: 'Unread' },
    summary: { type: String, required: true },
    isbn: { type: String, required: true }
  }
)

// Virtual for book's URL
BookSchema
  .virtual('url')
  .get(function () {
    return '/catalog/book/' + this._id
  })

// Export model
module.exports = mongoose.model('Book', BookSchema)
