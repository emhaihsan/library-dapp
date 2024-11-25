"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractAddress } from "../config";
import Library from "../abi/Library.json";
import { NextPage } from "next";
import Book from "./components/Book.js";
import LoadingSpinner from "./components/LoadingSpinner";

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

  const disconnectWallet = () => {
    setCurrentAccount("");
    setBooksFinished([]);
    setBooksUnfinished([]);
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center space-y-8 py-20">
          <div className="animate-float">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-[#f1c232] to-[#6a50aa] p-1">
              <div className="w-full h-full rounded-full bg-[#1a1a2e] flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-[#f1c232]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            </div>
          </div>

          <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-[#f1c232] to-[#6a50aa] text-transparent bg-clip-text">
            Web3 Library
          </h1>

          <p className="text-xl text-gray-400 text-center max-w-2xl">
            Manage your personal library on the blockchain. Connect your wallet
            to start tracking your reading journey in a decentralized way.
          </p>

          {currentAccount === "" ? (
            <div className="space-y-6">
              <button
                className="group relative px-12 py-4 text-xl font-bold bg-gradient-to-r from-[#f1c232] to-[#6a50aa] rounded-lg hover:scale-105 transition-all duration-300 ease-in-out"
                onClick={connectWallet}
              >
                <div className="absolute inset-0 w-full h-full bg-white/10 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center justify-center gap-2">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Connect Wallet
                </span>
              </button>

              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Sepolia Network</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>MetaMask Required</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold py-3 px-12 mb-4">
                Connected to: {currentAccount.slice(0, 6)}...
                {currentAccount.slice(-4)}
              </div>
              <button
                className="text-lg font-bold py-2 px-8 bg-red-500 text-white rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out"
                onClick={disconnectWallet}
              >
                Disconnect Wallet
              </button>
              <div className="bg-[#1f2937] p-8 rounded-lg shadow-lg mb-20 mt-4 w-96 border border-gray-700">
                <h3 className="text-2xl font-bold mb-6 text-center text-white">
                  Add New Book
                </h3>
                <div className="space-y-4">
                  <input
                    className="w-full px-4 py-2 bg-[#374151] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a50aa] text-white placeholder-gray-400"
                    type="text"
                    placeholder="Book Name"
                    value={bookName}
                    onChange={(e) => setBookName(e.target.value)}
                  />
                  <input
                    className="w-full px-4 py-2 bg-[#374151] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a50aa] text-white placeholder-gray-400"
                    type="text"
                    placeholder="Book Author"
                    value={bookAuthor}
                    onChange={(e) => setBookAuthor(e.target.value)}
                  />
                  <input
                    className="w-full px-4 py-2 bg-[#374151] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a50aa] text-white placeholder-gray-400"
                    type="number"
                    placeholder="Book Year"
                    value={bookYear}
                    onChange={(e) => setBookYear(e.target.value)}
                  />
                  <div className="flex items-center space-x-2">
                    <label className="text-gray-300">Reading Status:</label>
                    <select
                      className="flex-1 px-4 py-2 bg-[#374151] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a50aa] text-white"
                      value={bookFinished}
                      onChange={(e) => setBookFinished(e.target.value)}
                    >
                      <option value="yes">Finished</option>
                      <option value="no">Not Finished</option>
                    </select>
                  </div>
                  <button
                    className="w-full py-3 bg-gradient-to-r from-[#f1c232] to-[#6a50aa] text-white rounded-lg font-bold hover:opacity-90 transition duration-300"
                    onClick={submitBook}
                  >
                    Add Book
                  </button>
                </div>
              </div>
              <div className="flex flex-col justify-center items-center space-y-8">
                <div className="text-2xl font-bold text-center bg-gradient-to-r from-[#f1c232] to-[#6a50aa] text-transparent bg-clip-text">
                  Book List
                </div>
                <button
                  className="group relative px-12 py-4 text-xl font-bold bg-gradient-to-r from-[#f1c232] to-[#6a50aa] rounded-lg hover:scale-105 transition-all duration-300 ease-in-out min-w-[200px]"
                  onClick={getBooks}
                  disabled={isLoading}
                >
                  <div className="absolute inset-0 w-full h-full bg-white/10 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center justify-center gap-2">
                    {isLoading ? <LoadingSpinner /> : "Get Books"}
                  </span>
                </button>

                {booksUnfinished.length > 0 && (
                  <div className="w-full">
                    <h2 className="text-xl font-semibold text-center mb-6 text-gray-300">
                      Books Unfinished ({booksUnfinished.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
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
                  </div>
                )}

                {booksFinished.length > 0 && (
                  <div className="w-full">
                    <h2 className="text-xl font-semibold text-center mb-6 text-gray-300">
                      Books Finished ({booksFinished.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
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
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
