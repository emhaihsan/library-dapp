// SPDX License-Identifier: MIT
pragma solidity ^0.8.0;

// Contract to manage a library system
contract Library {
    // Struct to represent a book with its relevant details
    struct Book {
        uint id; // Unique identifier for the book
        string title; // Title of the book
        string author; // Author of the book
        uint year; // Year of publication
        bool finished; // Status indicating if the book has been read
    }

    // Array to store the list of books
    Book[] private bookList;

    // Mapping from book ID to the address of the owner
    mapping(uint256 => address) bookToOwner;

    // Event to be emitted when a new book is added
    event AddBook(address recipient, uint bookId);
    event SetFinished(uint bookId, bool finished);
    event EditBook(uint bookId, string name, uint16 year, string author);

    // Function to add a new book to the library
    // Only the caller of the function can add a book
    function addBook(
        string memory name,
        uint16 year,
        string memory author,
        bool finished
    ) external {
        uint bookId = bookList.length; // Assign a new book ID
        // Add the new book to the list
        bookList.push(Book(bookId, name, author, year, finished));
        // Map the new book to the owner
        bookToOwner[bookId] = msg.sender;
        // Emit an event for the added book
        emit AddBook(msg.sender, bookId);
    }

    // Private function to get the list of books based on their finished status
    // Only returns books owned by the caller
    function _getBookList(bool finished) private view returns (Book[] memory) {
        Book[] memory temporary = new Book[](bookList.length); // Temporary array to store matching books
        uint counter = 0; // Counter for matching books
        // Iterate through the list of books
        for (uint i = 0; i < bookList.length; i++) {
            // Check if the book is owned by the caller and matches the finished status
            if (
                bookToOwner[i] == msg.sender && bookList[i].finished == finished
            ) {
                temporary[counter] = bookList[i]; // Add to temporary list
                counter++;
            }
        }

        // Create an array with the exact number of matching books
        Book[] memory result = new Book[](counter);
        // Copy matching books to the result array
        for (uint i = 0; i < counter; i++) {
            result[i] = temporary[i];
        }
        return result; // Return the result array
    }

    function getFinishedBooks() external view returns (Book[] memory) {
        return _getBookList(true);
    }

    function getUnfinishedBooks() external view returns (Book[] memory) {
        return _getBookList(false);
    }

    function setFinished(uint bookId, bool finished) external {
        if (bookToOwner[bookId] == msg.sender) {
            bookList[bookId].finished = finished;
            emit SetFinished(bookId, finished);
        }
    }

    function editBook(
        uint bookId,
        string memory name,
        uint16 year,
        string memory author
    ) external {
        require(bookToOwner[bookId] == msg.sender, "Not book owner");
        bookList[bookId].title = name;
        bookList[bookId].year = year;
        bookList[bookId].author = author;
        emit EditBook(bookId, name, year, author);
    }
}
