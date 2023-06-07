const Hapi = require("@hapi/hapi");
const {
  addBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook,
} = require("./data");

async function run() {
  const server = Hapi.server({
    host: "localhost",
    port: 9000,
  });

  server.route([
    {
      method: "POST",
      path: "/books",
      handler: (request, h) => {
        const {
          name,
          year,
          author,
          summary,
          publisher,
          pageCount,
          readPage,
          reading,
        } = request.payload;

        if (!name) {
          const response = h.response({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku",
          });

          response.code(400);
          return response;
        }

        if (readPage > pageCount) {
          const response = h.response({
            status: "fail",
            message:
              "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
          });

          response.code(400);
          return response;
        }

        const bookId = addBook({
          name,
          year,
          author,
          summary,
          publisher,
          pageCount,
          readPage,
          reading,
        });

        const response = h.response({
          status: "success",
          message: "Buku berhasil ditambahkan",
          data: {
            bookId,
          },
        });

        response.code(201);
        return response;
      },
    },
    {
      method: "GET",
      path: "/books",
      handler: () => {
        const books = getBooks();

        return {
          status: "success",
          data: {
            books,
          },
        };
      },
    },
    {
      method: "GET",
      path: "/books/{bookId}",
      handler: (request, h) => {
        const { bookId } = request.params;
        const book = getBook(bookId);

        if (!book) {
          const response = h.response({
            status: "fail",
            message: "Buku tidak ditemukan",
          });
          response.code(404);
          return response;
        }

        return {
          status: "success",
          data: {
            book,
          },
        };
      },
    },
    {
      method: "PUT",
      path: "/books/{bookId}",
      handler: (request, h) => {
        const { bookId } = request.params;
        const {
          name,
          year,
          author,
          summary,
          publisher,
          pageCount,
          readPage,
          reading,
        } = request.payload;

        if (!name) {
          const response = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Mohon isi nama buku",
          });

          response.code(400);
          return response;
        }

        if (readPage > pageCount) {
          const response = h.response({
            status: "fail",
            message:
              "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
          });

          response.code(400);
          return response;
        }

        const isSuccess = updateBook({
          id: bookId,
          name,
          year,
          author,
          summary,
          publisher,
          pageCount,
          readPage,
          reading,
        });

        if (!isSuccess) {
          const response = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Id tidak ditemukan",
          });

          response.code(404);
          return response;
        }

        return {
          status: "success",
          message: "Buku berhasil diperbarui",
        };
      },
    },
    {
      method: "DELETE",
      path: "/books/{bookId}",
      handler: (request, h) => {
        const { bookId } = request.params;

        const isSuccess = deleteBook(bookId);

        if (!isSuccess) {
          const response = h.response({
            status: "fail",
            message: "Buku gagal dihapus. Id tidak ditemukan",
          });

          response.code(404);
          return response;
        }

        return {
          status: "success",
          message: "Buku berhasil dihapus",
        };
      },
    },
  ]);

  await server.start();

  console.log("Server running on %s", server.info.uri);
}

run();
