const Book = require('../models/book')
const Author = require('../models/author')

exports.authorList = function (req, res, next) {
  Author.find()
    .sort([['familyName', 'ascending']])
    .exec()
    .then((listOfAuthors) => {
      const results = { authorList: listOfAuthors }
      res.render('author-list', results)
    })
    .catch((err) => {
      return next(err)
    })
}
