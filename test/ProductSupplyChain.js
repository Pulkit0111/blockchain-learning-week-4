const { expect } = require("chai");

describe("ProductSupplyChain", function () {
  let owner;
  let externalRegistry;
  let productSupplyChain;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();

    const Registry = await ethers.getContractFactory("Registry");
    externalRegistry = await Registry.deploy();

    const ProductSupplyChain = await ethers.getContractFactory("ProductSupplyChain");
    productSupplyChain = await ProductSupplyChain.deploy(externalRegistry.address);

    await productSupplyChain.deployed();
  });

  it("should allow the owner to create a product", async function () {
    await productSupplyChain.createProduct("Product 1", 100);

    const product = await productSupplyChain.products(1);

    expect(product.productId).to.equal(1);
    expect(product.name).to.equal("Product 1");
    expect(product.currentOwner).to.equal(owner.address);
    expect(product.price).to.equal(100);
    expect(product.state).to.equal(0);
  });

  it("should not allow non-owner to create a product", async function () {
    const [, nonOwner] = await ethers.getSigners();

    await expect(productSupplyChain.connect(nonOwner).createProduct("Product 1", 100)).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("should allow the owner to sell a product to a valid new owner", async function () {
    await productSupplyChain.createProduct("Product 1", 100);

    const [, newOwner] = await ethers.getSigners();

    await externalRegistry.setCondition(newOwner.address, true);
    await productSupplyChain.sellProduct(1, newOwner.address);

    const product = await productSupplyChain.products(1);

    expect(product.currentOwner).to.equal(newOwner.address);
    expect(product.state).to.equal(1);
  });

  it("should not allow selling to a new owner that does not meet external conditions", async function () {
    await productSupplyChain.createProduct("Product 1", 100);

    const [, newOwner] = await ethers.getSigners();

    await externalRegistry.setCondition(newOwner.address, false);

    await expect(productSupplyChain.sellProduct(1, newOwner.address)).to.be.revertedWith("Condition in external registry not met");
  });

  it("should not allow non-owner to sell a product", async function () {
    await productSupplyChain.createProduct("Product 1", 100);

    const [, nonOwner] = await ethers.getSigners();

    await expect(productSupplyChain.connect(nonOwner).sellProduct(1, nonOwner.address)).to.be.revertedWith("Only the owner can perform this action");
  });

  it("should not allow selling a non-existent product", async function () {
    const [, newOwner] = await ethers.getSigners();

    await expect(productSupplyChain.sellProduct(1, newOwner.address)).to.be.revertedWith("Product does not exist");
  });
});

