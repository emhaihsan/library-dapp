const { ethers } = require("hardhat");

const main = async () => {
  const contractFactory = await ethers.getContractFactory("Library");
  const contract = await contractFactory.deploy();
  await contract.waitForDeployment();

  console.log("Library deployed to:", await contract.getAddress());
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();

// Library deployed to: 0x145f248f347f3Fae2B9F7B5b1e9bBad53A1B7790
