const { nanoid } = require("nanoid");

// ambil semua data books
const books = [];

// {
//     "name": string,
//     "year": number,
//     "author": string,
//     "summary": string,
//     "publisher": string,
//     "pageCount": number,
//     "readPage": number,
//     "reading": boolean
// }

//
function addBook(book) {
  const id = nanoid(16);
  const finished = book.readPage === book.pageCount;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    ...book,
    finished,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  return id;
}
//

//
function getBooks() {
  return books.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));
}
//

//
function getBook(id) {
  const book = books.filter((b) => b.id === id)[0];

  if (!book) {
    return null;
  }

  return book;
}
//

//
function updateBook(book) {
  const { id } = book;

  const index = books.findIndex((b) => b.id === id);

  if (index === -1) {
    return false;
  }

  const finished = book.readPage === book.pageCount;

  books[index] = {
    ...books[index],
    ...book,
    finished,
    updatedAt: new Date().toISOString(),
  };

  return true;
}
//

//
function deleteBook(id) {
  const index = books.findIndex((book) => book.id === id);

  if (index === -1) {
    return false;
  }

  books.splice(index, 1);

  return true;
}
//

// export ke server
module.exports = {
  addBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook,
};
