#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true')

// Get arguments passed on command line
const userArgs = process.argv.slice(2)
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
const Book = require('../models/book')
const Author = require('../models/author')
const Genre = require('../models/genre')

const mongoose = require('mongoose')
const mongoDB = userArgs[0]
mongoose.connect(mongoDB, { useNewUrlParser: true })
mongoose.Promise = global.Promise
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

const authors = []
const genres = []
const books = []

function createAuthor (firstName, familyName, dateOfBirth, dateOfDeath) {
  const authordetail = {
    firstName: firstName,
    familyName: familyName
  }
  if (dateOfBirth !== false) authordetail.dateOfBirth = dateOfBirth
  if (dateOfDeath !== false) authordetail.dateOfDeath = dateOfDeath

  const author = new Author(authordetail)

  return author.save()
    .then((result) => {
      console.log('New Author: ', result)
      authors.push(result)
    })
    .catch((error) => {
      console.log('createauthor error', error)
      return (error)
    })
}

function createGenre (name) {
  const genre = new Genre({ name: name })

  return genre.save()
    .then((result) => {
      console.log('New Genre: ', result)
      genres.push(result)
    })
    .catch((error) => {
      console.log('createGenre error', error)
      return (error)
    })
}

function createBook (title, author, genre, status, summary, isbn) {
  const bookdetail = {
    title: title,
    author: author,
    genre: genre,
    status: status,
    summary: summary,
    isbn: isbn
  }
  if (genre !== false) bookdetail.genre = genre

  const book = new Book(bookdetail)
  return book.save()
    .then((result) => {
      console.log('New Book: ', result)
      books.push(result)
    })
    .catch((error) => {
      console.log('createBook error', error)
      return (error)
    })
}

function deleteBooks (callback) {
  return Book.remove(callback)
}

function deleteAuthors (callback) {
  return Author.remove(callback)
}

function deleteGenres (callback) {
  return Genre.remove(callback)
}

function createAllGenres () {
  const p1 = createGenre('Fiction')
  const p2 = createGenre('Art')
  const p3 = createGenre('Poetry')
  return Promise.all([p1, p2, p3])
}

function createAllAuthors () {
  const p1 = createAuthor('Milan', 'Kundera', '1920-01-02', '1992-04-06')
  const p2 = createAuthor('William', 'Shakespear', '1830-01-02', '1894-04-06')
  const p3 = createAuthor('Jose', 'Saramago', '1935-01-02', '1999-04-06')
  return Promise.all([p1, p2, p3])
}

function createAllBooks () {
  const p1 = createBook('The Name of the Wind (The Kingkiller Chronicle, #1)', authors[0], [genres[0]], 'Read', 'I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep.', '9781473211896')
  const p2 = createBook('The Wise Mans Fear (The Kingkiller Chronicle, #2)', authors[1], [genres[1]], 'Unread', 'Picking up the tale of Kvothe Kingkiller once again, we follow him into exile, into political intrigue, courtship, adventure, love and magic... and further along the path that has turned Kvothe, the mightiest magician of his age, a legend in his own time, into Kote, the unassuming pub landlord.', '9788401352836')
  const p3 = createBook('The Slow Regard of Silent Things (Kingkiller Chronicle)', authors[1], [genres[0]], 'Read', 'Deep below the University, there is a dark place. Few people know of it: a broken web of ancient passageways and abandoned rooms. A young woman lives there, tucked among the sprawling tunnels of the Underthing, snug in the heart of this forgotten place.', '9780756411336')
  const p4 = createBook('Foo Bar', authors[2], [genres[2]], 'Read', 'Deep below the University, there is a dark place. Few people know of it: a broken web of ancient passageways and abandoned rooms. A young woman lives there, tucked among the sprawling tunnels of the Underthing, snug in the heart of this forgotten place.', '9780756411336')
  return Promise.all([p1, p2, p3, p4])
}

deleteGenres()
  .then(() => {
    return deleteAuthors()
  })
  .then(() => {
    return deleteBooks()
  })
  .then(() => {
    return createAllAuthors()
  })
  .then(() => {
    return createAllGenres()
  })
  .then(() => {
    return createAllBooks()
  })
  .then(() => {
    mongoose.connection.close()
  })

  .catch((error) => {
    console.log('error', error)
    return (error)
  })
