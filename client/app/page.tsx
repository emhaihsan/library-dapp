"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractAddress } from "../config";
import Library from "../abi/Library.json";
import { NextPage } from "next";
import Book from "./components/Book.js";

interface BookType {
  id: string;
  title: string;
  year: string;
  author: string;
  finished: boolean;
}

declare let window: any;

const Home: NextPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");
  const [bookName, setBookName] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookYear, setBookYear] = useState("");
  const [bookFinished, setBookFinished] = useState("no");
  const [booksUnfinished, setBooksUnfinished] = useState<BookType[]>([]);
  const [booksFinished, setBooksFinished] = useState<BookType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (currentAccount !== "") {
      getBooks();
    }
  }, [currentAccount]);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
        return;
      }

      let chainId = await ethereum.request({ method: "eth_chainId" });
      const sepoliaChainId = "0xaa36a7";

      if (chainId !== sepoliaChainId) {
        alert("You are not on the Sepolia Testnet!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log("Error connecting to Metamask:", error);
    }
  };

  const submitBook = async () => {
    let book = {
      title: bookName,
      year: bookYear,
      author: bookAuthor,
      finished: bookFinished == "yes" ? true : false,
    };
    if (!bookName || !bookAuthor || !bookYear) {
      return;
    }
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          Library.abi,
          signer
        );

        let libraryTx = await contract.addBook(
          book.title,
          book.year,
          book.author,
          book.finished
        );
        console.log("Book added to the library!", libraryTx);
      } else {
        console.log("Ethereum object not found!");
      }
    } catch (error) {
      console.log("Error submitting the new book", error);
    }
  };

  const getBooks = async () => {
    setIsLoading(true);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          Library.abi,
          signer
        );
        const unfinishedBooks = await contract.getUnfinishedBooks();
        const finishedBooks = await contract.getFinishedBooks();
        setBooksUnfinished(unfinishedBooks);
        setBooksFinished(finishedBooks);
      } else {
        console.log("Ethereum object not found!");
      }
    } catch (error) {
      console.log("Error getting the books", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clickBookFinished = async (id: string) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          Library.abi,
          signer
        );
        let libraryTx = await contract.setFinished(id, true);
        console.log("Book finished!", libraryTx);
      } else {
        console.log("Ethereum object not found!");
      }
    } catch (error) {
      console.log("Error finishing the book", error);
    }
  };

  const editBook = async (
    id: number,
    name: string,
    year: number,
    author: string
  ) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          Library.abi,
          signer
        );

        let libraryTx = await contract.editBook(id, name, year, author);
        await libraryTx.wait();
        console.log("Book edited!", libraryTx);

        // Refresh daftar buku
        getBooks();
      }
    } catch (error) {
      console.log("Error editing the book", error);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex flex-col items-center bg-[#f3f6f4] text-[#6a50aa]">
      <div className="transition hover:rotate-180 hover:scale-105 duration-500 ease-in-out"></div>
      <h2 className="text-3xl font-bold mb-20 mt-12">
        Manage your personal library
      </h2>
      {currentAccount === "" ? (
        <button
          className="text-2xl font-bold py-3 px-12 bg-[#f1c232] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      ) : (
        <div>
          <div className="text-2xl font-bold py-3 px-12 mb-10 hover:scale-105 transition duration-500 ease-in-out">
            Connected to: {currentAccount}
          </div>
          <div className="text-xl font-semibold mb-20 mt-4">
            <input
              className="text-xl font-bold mb-2 mt-1"
              type="text"
              placeholder="Book Name"
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
            />
            <br />
            <input
              className="text-xl font-bold mb-2 mt-1"
              type="text"
              placeholder="Book Author"
              value={bookAuthor}
              onChange={(e) => setBookAuthor(e.target.value)}
            />
            <br />
            <input
              className="text-xl font-bold mb-2 mt-1"
              type="number"
              placeholder="Book Year"
              value={bookYear}
              onChange={(e) => setBookYear(e.target.value)}
            />
            <br />
            <label>
              Have you Finished reading this book?
              <select
                className="text-xl font-bold mb-2 mt-1"
                value={bookFinished}
                onChange={(e) => setBookFinished(e.target.value)}
              >
                <option value="yes">Finished</option>
                <option value="no">Not Finished</option>
              </select>
            </label>
            <br />
            <button
              className="text-2xl font-bold py-3 px-12 bg-[#f1c232] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out"
              onClick={submitBook}
            >
              Add Book
            </button>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="font-semibold text-lg text-center mb-4">
              Book List
            </div>
            <button
              className="text-xl font-bold py-3 px-12 bg-[#f1c232] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out"
              onClick={getBooks}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Get Books"}
            </button>
            {booksUnfinished.length > 0 ? (
              <div className="font-semibold text-lg text-center mb-4">
                Books Unfinished ({booksUnfinished.length})
              </div>
            ) : (
              <div></div>
            )}
            <div className="flex flex-row flex-wrap justify-center">
              {booksUnfinished.map((book) => (
                <Book
                  key={book.id}
                  id={parseInt(book.id)}
                  name={book.title}
                  year={parseInt(book.year)}
                  author={book.author}
                  finished={book.finished.toString()}
                  clickBookFinished={clickBookFinished}
                  onEdit={editBook}
                />
              ))}
            </div>
            {booksFinished.length > 0 ? (
              <div className="font-semibold text-lg text-center mb-4">
                Books Finished ({booksFinished.length})
              </div>
            ) : (
              <div></div>
            )}
            <div className="flex flex-row flex-wrap justify-center">
              {booksFinished.map((book) => (
                <Book
                  key={book.id}
                  id={parseInt(book.id)}
                  name={book.title}
                  year={parseInt(book.year)}
                  author={book.author}
                  finished={book.finished.toString()}
                  clickBookFinished={clickBookFinished}
                  onEdit={editBook}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
