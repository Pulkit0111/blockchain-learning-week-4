// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  // Deploy the Registry contract
  const Registry = await ethers.getContractFactory("Registry");
  const registry = await Registry.deploy();

  await registry.deployed();
  console.log("Registry deployed to:", registry.address);

  // Deploy the ProductSupplyChain contract, passing the address of the Registry
  const ProductSupplyChain = await ethers.getContractFactory("ProductSupplyChain");
  const productSupplyChain = await ProductSupplyChain.deploy(registry.address);

  await productSupplyChain.deployed();
  console.log("ProductSupplyChain deployed to:", productSupplyChain.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
