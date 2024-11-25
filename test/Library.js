const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Library", function () {
  let Library;
  let library;
  let owner;

  const NUM_UNFINISHED_BOOK = 5; //dummy data
  const NUM_FINISHED_BOOK = 3;

  let unfinishedBookList;
  let finishedBookList;

  function verifyBook(bookChain, book) {
    expect(bookChain.title).to.equal(book.title);
    expect(bookChain.year).to.equal(book.year);
    expect(bookChain.author).to.equal(book.author);
    expect(bookChain.finished).to.equal(book.finished);
  }

  function verifyBookList(booksFromChain, bookList) {
    expect(booksFromChain.length).to.not.equal(0);
    expect(booksFromChain.length).to.equal(bookList.length);

    for (let i = 0; i < booksFromChain.length; i++) {
      const bookChain = booksFromChain[i];
      const book = bookList[i];
      verifyBook(bookChain, book);
    }
  }

  beforeEach(async function () {
    Library = await ethers.getContractFactory("Library");
    library = await Library.deploy();
    [owner] = await ethers.getSigners();

    unfinishedBookList = [];
    finishedBookList = [];

    for (let i = 0; i < NUM_UNFINISHED_BOOK; i++) {
      let book = {
        title: "Book " + i,
        year: 2000 + i,
        author: "Author " + i,
        finished: false,
      };
      await library.addBook(book.title, book.year, book.author, book.finished);
      unfinishedBookList.push(book);
    }

    for (let i = 0; i < NUM_FINISHED_BOOK; i++) {
      book = {
        title: "Book " + i,
        year: 2000 + i,
        author: "Author " + i,
        finished: true,
      };
      await library.addBook(book.title, book.year, book.author, book.finished);
      finishedBookList.push(book);
    }
  });

  describe("addBook", function () {
    it("should add a new book to the library", async function () {
      const newBook = {
        title: "New Book",
        year: 2023,
        author: "John Doe",
        finished: false,
      };

      await expect(
        library.addBook(
          newBook.title,
          newBook.year,
          newBook.author,
          newBook.finished
        )
      )
        .to.emit(library, "AddBook")
        .withArgs(owner.address, NUM_FINISHED_BOOK + NUM_UNFINISHED_BOOK);
    });
  });

  describe("Get Books", function () {
    it("should return the list of unfinished books", async function () {
      const books = await library.getUnfinishedBooks();
      expect(books.length).to.equal(NUM_UNFINISHED_BOOK);
      verifyBookList(books, unfinishedBookList);
    });
    it("should return the list of finished books", async function () {
      const books = await library.getFinishedBooks();
      expect(books.length).to.equal(NUM_FINISHED_BOOK);
      verifyBookList(books, finishedBookList);
    });
  });

  describe("Set Finished", function () {
    it("should set the book as finished", async function () {
      const bookId = 0;
      await expect(library.setFinished(bookId, true))
        .to.emit(library, "SetFinished")
        .withArgs(bookId, true);
    });
  });

  describe("Edit Book", function () {
    it("should edit an existing book", async function () {
      const bookId = 0;
      const updatedBook = {
        title: "Updated Book Title",
        year: 2024,
        author: "Updated Author",
      };

      await expect(
        library.editBook(
          bookId,
          updatedBook.title,
          updatedBook.year,
          updatedBook.author
        )
      )
        .to.emit(library, "EditBook")
        .withArgs(
          bookId,
          updatedBook.title,
          updatedBook.year,
          updatedBook.author
        );

      // Verify the book was updated
      const unfinishedBooks = await library.getUnfinishedBooks();
      const updatedBookFromChain = unfinishedBooks[0];

      expect(updatedBookFromChain.title).to.equal(updatedBook.title);
      expect(updatedBookFromChain.year).to.equal(updatedBook.year);
      expect(updatedBookFromChain.author).to.equal(updatedBook.author);
    });

    it("should only allow book owner to edit", async function () {
      const [_, otherAccount] = await ethers.getSigners();
      const bookId = 0;
      const updatedBook = {
        title: "Updated Book Title",
        year: 2024,
        author: "Updated Author",
      };

      await expect(
        library
          .connect(otherAccount)
          .editBook(
            bookId,
            updatedBook.title,
            updatedBook.year,
            updatedBook.author
          )
      ).to.be.revertedWith("Not book owner");
    });
  });
});
