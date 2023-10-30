// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

// Interface for an external registry
interface Registry {
    function verifyCondition(address productOwner) external view returns (bool);
}

contract ProductSupplyChain is Ownable {
    struct Product {
        uint256 productId;
        string name;
        address currentOwner;
        uint256 price;
        uint8 state; // 0: Created, 1: Sold
    }

    mapping(uint256 => Product) public products;
    uint256 public productCount;

    Registry public externalRegistry;

    event ProductCreated(uint256 productId, string name, address currentOwner, uint256 price);
    event ProductSold(uint256 productId, address previousOwner, address newOwner, uint256 price);
    event OwnershipTransferred(address previousOwner, address newOwner);

    constructor(address _externalRegistry) {
        externalRegistry = Registry(_externalRegistry);
    }

    modifier productExists(uint256 _productId) {
        require(products[_productId].productId != 0, "Product does not exist");
        _;
    }

    modifier onlyProductOwner(uint256 _productId) {
        require(products[_productId].currentOwner == msg.sender, "Only the owner can perform this action");
        _;
    }

    function createProduct(string memory _name, uint256 _price) public onlyOwner {
        productCount++;
        Product storage newProduct = products[productCount];
        newProduct.productId = productCount;
        newProduct.name = _name;
        newProduct.currentOwner = owner();
        newProduct.price = _price;
        newProduct.state = 0;

        emit ProductCreated(productCount, _name, owner(), _price);
    }

    function sellProduct(uint256 _productId, address _newOwner) public productExists(_productId) onlyProductOwner(_productId) {
        require(externalRegistry.verifyCondition(_newOwner), "Condition in external registry not met");
        products[_productId].currentOwner = _newOwner;
        products[_productId].state = 1;

        emit ProductSold(_productId, msg.sender, _newOwner, products[_productId].price);
    }

    function transferOwnership(address _newOwner) public onlyOwner {
        require(_newOwner != address(0), "Invalid new owner address");
        emit OwnershipTransferred(owner(), _newOwner);
        super.transferOwnership(_newOwner);
    }
}
