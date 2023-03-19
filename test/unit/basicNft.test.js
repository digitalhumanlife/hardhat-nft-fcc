const { assert } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Basic NFT unit tests", function () {
          let basicNft, deployer

          beforeEach(async () => {
              const accounts = await ethers.getSigners()
              deployer = accounts[0]
              await deployments.fixture(["basicnft"])
              basicNft = await ethers.getContract("BasicNft")
          })

          describe("Constructor", () => {
              it("Initialize the NFT correctly", async () => {
                  const name = await basicNft.name()
                  const symbol = await basicNft.symbol()
                  const tokenCounter = await basicNft.getTokenCounter()

                  assert.equal(name, "Dogie")
                  assert.equal(symbol, "DOG")
                  assert.equal(tokenCounter.toString(), "0")
              })
          })

          describe("Mint NFT", () => {
              beforeEach(async () => {
                  const txResponse = await basicNft.mintNft()
                  await txResponse.wait(1)
              })
              it("allows users to mint an nft, and update tokencounter", async () => {
                  const tokenURI = await basicNft.tokenURI(0)
                  const tokenCounter = await basicNft.getTokenCounter()

                  assert.equal(tokenCounter.toString(), "1")
                  assert.equal(tokenURI, await basicNft.TOKEN_URI())
              })
              it("Show correct balance and owner of an NFT", async () => {
                  const deployerAddress = deployer.address
                  const deployerBalance = await basicNft.balanceOf(deployerAddress)
                  const owner = await basicNft.ownerOf("0")
                  console.log("deployer Balance: " + deployerBalance)

                  assert.equal(deployerBalance.toString(), "1")
                  assert.equal(owner, deployerAddress)
              })
          })
      })
