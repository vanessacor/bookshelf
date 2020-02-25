#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
const async = require('async')
const Book = require('./models/book')
const Author = require('./models/author')
const Genre = require('./models/genre')


const mongoose = require('mongoose');
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const authors = []
const genres = []
const books = []

function createAuthor(firstName, familyName, dateOfBirth, dateOfDeath, cb) {
  authordetail = {
    firstName:firstName, 
    familyName: familyName 
  }
  if (dateOfBirth != false) authordetail.dateOfBirth = dateOfBirth
  if (dateOfDeath != false) authordetail.dateOfDeath = dateOfDeath
  
  const author = new Author(authordetail);
       
  author.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Author: ' + author);
    authors.push(author)
    cb(null, author)
  }  );
}

function createGenre(name, cb) {
  const genre = new Genre({ name: name });
       
  genre.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Genre: ' + genre);
    genres.push(genre)
    cb(null, genre);
  }   );
}

function bookCreate(title, author, genre, status, summary, isbn, cb) {
  bookdetail = { 
    title: title,
    author: author,
    genre: genre,
    status: status,
    summary: summary,
    isbn: isbn
  }
  if (genre != false) bookdetail.genre = genre
    
  const book = new Book(bookdetail);    
  book.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Book: ' + book);
    books.push(book)
    cb(null, book)
  }  );
}

function deleteBooks (callback) {
  Book.remove(callback)
}

function deleteAuthors (callback) {
  Author.remove(callback)
}

function deleteGenres (callback) {
  Genre.remove(callback)
}

function createGenreAuthors(cb) {
  async.series([
    function(callback) {
      createAuthor('Patrick', 'Rothfuss', '1973-06-06', false, callback);
    },
    function(callback) {
      createAuthor('Ben', 'Bova', '1932-11-8', false, callback);
    },
    function(callback) {
      createAuthor('Isaac', 'Asimov', '1920-01-02', '1992-04-06', callback);
    },
    function(callback) {
      createAuthor('Bob', 'Billings', '1930-08-22', false, callback);
    },
    function(callback) {
      createAuthor('Jim', 'Jones', '1971-12-16', false, callback);
    },
    function(callback) {
      createGenre("Fantasy", callback);
    },
    function(callback) {
      createGenre("Science Fiction", callback);
    },
    function(callback) {
      createGenre("French Poetry", callback);
    },
    ],
    // optional callback
  cb);
}


function createBooks(cb) {
  async.parallel([
    function(callback) {
      bookCreate('The Name of the Wind (The Kingkiller Chronicle, #1)',  authors[0], [genres[0],], 'Read', 'I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep.', '9781473211896', callback);
    },
    function(callback) {
      bookCreate('The Wise Mans Fear (The Kingkiller Chronicle, #2)', authors[0], [genres[0],], 'Unread', 'Picking up the tale of Kvothe Kingkiller once again, we follow him into exile, into political intrigue, courtship, adventure, love and magic... and further along the path that has turned Kvothe, the mightiest magician of his age, a legend in his own time, into Kote, the unassuming pub landlord.', '9788401352836', callback);
    },
    function(callback) {
      bookCreate('The Slow Regard of Silent Things (Kingkiller Chronicle)', authors[0], [genres[0],], 'Read', 'Deep below the University, there is a dark place. Few people know of it: a broken web of ancient passageways and abandoned rooms. A young woman lives there, tucked among the sprawling tunnels of the Underthing, snug in the heart of this forgotten place.', '9780756411336', callback);
    },
    function(callback) {
      bookCreate("Apes and Angels", authors[1], [genres[1],], 'Read', "Humankind headed out to the stars not for conquest, nor exploration, nor even for curiosity. Humans went to the stars in a desperate crusade to save intelligent life wherever they found it. A wave of death is spreading through the Milky Way galaxy, an expanding sphere of lethal gamma ...", '9780765379528', callback);
    },
    function(callback) {
      bookCreate('Death Wave', authors[1], [genres[1],], 'Unread', "In Ben Bova's previous novel New Earth, Jordan Kell led the first human mission beyond the solar system. They discovered the ruins of an ancient alien civilization. But one alien AI survived, and it revealed to Jordan Kell that an explosion in the black hole at the heart of the Milky Way galaxy has created a wave of deadly radiation, expanding out from the core toward Earth. Unless the human race acts to save itself, all life on Earth will be wiped out...", '9780765379504', callback);
    },
    function(callback) {
      bookCreate('Test Book 1', authors[4], [genres[0],genres[1]], 'Read', 'Summary of test book 1', 'ISBN111111',  callback);
    },
    function(callback) {
      bookCreate('Test Book 2',  authors[4], [genres[0],genres[1]], 'Unread', 'Summary of test book 2', 'ISBN222222', callback)
    }
    ],
    // optional callback
  cb);
}


async.series([
  deleteGenres,
  deleteAuthors,
  deleteBooks,
  createGenreAuthors,
  createBooks,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('BOOKs: '+ books);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});