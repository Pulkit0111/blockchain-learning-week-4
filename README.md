# Blockchain Learning Week 4

## Overview

The ProductSupplyChain smart contract is a Solidity-based Ethereum smart contract that simulates a basic supply chain process for a product, from creation to the end sale. This README provides an overview of the contract's functionality, assumptions, and specific conditions.

## Contract Details

### Contract Name: ProductSupplyChain

### Structs and State Variables

- **Product Struct**: Represents a product with properties such as `productId`, `name`, `currentOwner`, `price`, and `state`.
- **State Variables**: 
    - `products`: A mapping that stores `Product` instances by their `productId`.
    - `productCount`: A variable to keep track of the number of products created.

### Functionality

1. **Ownership (Access Control)**
    - The contract uses the Ownable pattern to manage ownership. Only the owner can perform administrative actions.
2. **Creating a Product**
    - The `createProduct` function allows the owner to create a new product, setting the creator as the `currentOwner`.
3. **Modifiers and Restrictions**
    - `productExists` modifier: Ensures that a product with a given ID exists.
    - `onlyProductOwner` modifier: Restricts functionality to the owner of the product.
4. **Interacting with Other Contracts**
    - The contract interacts with an external registry contract to verify a condition before selling a product.
5. **Events and Transaction Information**
    - Events are implemented for actions like `ProductCreated`, `ProductSold`, and `OwnershipTransferred`.
6. **Sale Process**
    - The `sellProduct` function simulates the product sale, transferring ownership and updating relevant information.
7. **Error Handling**
    - Error handling is implemented for conditions like non-existent product IDs, actions restricted to the owner, or invalid operations.

## Assumptions and Specific Conditions

- The contract assumes that an external `Registry` contract exists and is used to verify certain conditions before a product is sold. This condition is checked in the `sellProduct` function.
- The contract assumes that the ownership starts with the contract deployer (the owner), and only the owner can create products and transfer ownership.
- Products are created sequentially with a unique `productId`.

## Getting Started

To deploy and interact with the contract, follow these steps:

1. Install the necessary dependencies using `npm install` or `yarn install`.
2. Deploy the `ProductSupplyChain` contract to an Ethereum network.
3. Deploy or provide the address of the external `Registry` contract.
4. Interact with the contract using a web3.js or ethers.js application.

## Testing

Comprehensive unit tests for the contract are included in the project. You can run the tests using Hardhat.

```bash
npx hardhat test
