const { getAllBooksHandler, addBooksHandler } = require('./handler');

const routes = [
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
  },
  {
    method: 'POST',
    path: '/books',
    handler: addBooksHandler,
  },
];

module.exports = routes;
