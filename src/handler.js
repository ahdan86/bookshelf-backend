const { nanoid } = require('nanoid');
const books = require('./books');

const setFailResponseStatusMessage = (h, statusText, messageText, responseCode) => {
  const response = h.response({
    status: statusText,
    message: messageText,
  });
  response.code(responseCode);
  return response;
};

const addBooksHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  if (typeof name === 'undefined') {
    return setFailResponseStatusMessage(h, 'fail', 'Gagal menambahkan buku. Mohon isi nama buku', 400);
  }

  if (readPage > pageCount) {
    return setFailResponseStatusMessage(h, 'fail', 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount', 400);
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  return setFailResponseStatusMessage(h, 'error', 'Buku gagal ditambahkan', 500);
};

const getAllBooksHandler = () => ({
  status: 'success',
  data: {
    books: books.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    })),
  },
});

module.exports = { getAllBooksHandler, addBooksHandler };
