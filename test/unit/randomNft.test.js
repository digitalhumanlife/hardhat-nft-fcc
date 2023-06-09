const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Random NFT unit tests", function () {
          let deployer, randomIpfsNft

          beforeEach(async function () {
              // get signers
              const accounts = await ethers.getSigners()
              // get deployer account
              deployer = accounts[0]
              console.log("deployer: " + deployer)
              // deploy fixtures
              await deployments.fixture(["mocks", "randomipfs"])
              // get the contract
              randomIpfsNft = await ethers.getContract("RandomIpfsNft")
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
          })

          describe("Constructor", function () {
              it("Is initialized correctly", async function () {
                  const dogTokenUriZero = await randomIpfsNft.getDogTokenUris(0)
                  console.log(dogTokenUriZero)
                  assert(dogTokenUriZero.includes("ipfs://"))
              })
          })

          describe("requestRandomNft", function () {
              it("Error thrown for low eth when minting", async function () {
                  await expect(randomIpfsNft.requestNft()).to.be.revertedWith(
                      "RandomIpfsNft__NeedMoreETHSent"
                  )
              })
              it("emits event when minting", async function () {
                  const minimumFee = await randomIpfsNft.getMintFee()
                  await expect(randomIpfsNft.requestNft({ value: minimumFee })).to.emit(
                      randomIpfsNft,
                      "NftRequested"
                  )
              })
          })
      })
