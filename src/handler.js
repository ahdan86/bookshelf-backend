const { nanoid } = require('nanoid');
const books = require('./books');

const setResponseStatusMessage = (h, statusText, messageText, responseCode) => {
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
    return setResponseStatusMessage(h, 'fail', 'Gagal menambahkan buku. Mohon isi nama buku', 400);
  }

  if (readPage > pageCount) {
    return setResponseStatusMessage(h, 'fail', 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount', 400);
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

  return setResponseStatusMessage(h, 'error', 'Buku gagal ditambahkan', 500);
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  let booksData = books;

  if (typeof name !== 'undefined') {
    booksData = booksData.filter((b) => b.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (typeof reading !== 'undefined') {
    booksData = booksData.filter((b) => b.reading === (parseInt(reading, 10) !== 0));
  }

  if (typeof finished !== 'undefined') {
    booksData = booksData.filter((b) => b.finished === (parseInt(finished, 10) !== 0));
  }

  const response = h.response({
    status: 'success',
    data: {
      books: booksData.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((b) => b.id === bookId)[0];
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  return setResponseStatusMessage(h, 'fail', 'Buku tidak ditemukan', 404);
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  if (typeof name === 'undefined') {
    return setResponseStatusMessage(h, 'fail', 'Gagal memperbarui buku. Mohon isi nama buku', 400);
  }

  if (readPage > pageCount) {
    return setResponseStatusMessage(h, 'fail', 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount', 400);
  }

  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    return setResponseStatusMessage(h, 'success', 'Buku berhasil diperbarui', 200);
  }

  return setResponseStatusMessage(h, 'fail', 'Gagal memperbarui buku. Id tidak ditemukan', 404);
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    books.splice(index, 1);
    return setResponseStatusMessage(h, 'success', 'Buku berhasil dihapus', 200);
  }

  return setResponseStatusMessage(h, 'fail', 'Buku gagal dihapus. Id tidak ditemukan', 404);
};

module.exports = {
  getAllBooksHandler,
  addBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
