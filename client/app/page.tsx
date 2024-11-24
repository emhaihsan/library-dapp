"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractAddress } from "../config";
import Library from "../abi/Library.json";
import { NextPage } from "next";

declare let window: any;

const Home: NextPage = () => {
  const [currentAccount, setCurrentAccount] = useState("");
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
  return (
    <div className="flex flex-col items-center -bg[#f3f6f4] text-[#6a50aa]">
      <div className="transition hover:rotate-180 hover:scale-105 transition duration-500 ease-in-out"></div>
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
        <div className="text-2xl font-bold py-3 px-12 mb-10 hover:scale-105 transition duration-500 ease-in-out">
          Connected to: {currentAccount}
        </div>
      )}
    </div>
  );
};

export default Home;
