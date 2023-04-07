const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const fs = require("fs")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // BasicNFT
    // const basicNft = await ethers.getContract("BasicNft", deployer)
    // const basicMintTx = await basicNft.mintNft()
    // await basicMintTx.wait(1)
    // console.log(`BasicNFT index 0 has tokenURI: ${await basicNft.tokenURI(0)}`)
    // console.log("basic done")

    const randomIpfsNft = await ethers.getContract("RandomIpfsNft", deployer)
    const mintFee = await randomIpfsNft.getMintFee()
    const randomIpfsNftMintTx = await randomIpfsNft.requestNft({ value: mintFee.toString() })
    const randomIpfsNftMintTxReceipt = await randomIpfsNftMintTx.wait(1)
    // Need to listen for response
    await new Promise(async (resolve, reject) => {
        setTimeout(() => reject("Timeout: 'NFTMinted' event did not fire"), 300000) // 5 minute timeout time
        // setup listener for our event
        randomIpfsNft.once("NftMinted", async () => {
            console.log(`Random IPFS NFT index 0 tokenURI: ${await randomIpfsNft.tokenURI(0)}`)
            resolve()
        })
        if (chainId == 31337) {
            const requestId = randomIpfsNftMintTxReceipt.events[1].args.requestId.toString()
            const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
            await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, randomIpfsNft.address)
        }
    })

    // Random IPFS NFT
    // console.log(": random going in!")
    // const randomIpfsNft = await ethers.getContract("RandomIpfsNft", deployer)
    // console.log(": random on")
    // const mintFee = await randomIpfsNft.getMintFee()
    // console.log(": Got mint fee")

    // await new Promise(async (resolve, reject) => {
    //     console.log(": in promise")
    //     setTimeout(resolve, 300000) // 5 mins
    //     randomIpfsNft.once("NftMinted", async function () {
    //         console.log(": NFT mined resolve!")
    //         resolve()
    //     })
    //     console.log(": request NFT")
    //     const randomIpfsNftMintTx = await randomIpfsNft.requestNft({ value: mintFee.toString() })
    //     const randomIpfsNftMintTx = await randomIpfsNft.requestNft({ value: mintFee.toString() })
    //     console.log(": request NFT done!")
    //     const randomIpfsNftMintTxReceipt = await randomIpfsNftMintTx.wait(1)
    //     console.log(": request NFT waiting done!")
    //     if (developmentChains.includes(network.name)) {
    //         const requestId = randomIpfsNftMintTxReceipt.events[1].args.requestId.toString()
    //         const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
    //         await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, randomIpfsNft.address)
    //     }
    // })
    // console.log(`Random IPFS NFT index 0 tokenURI: ${await randomIpfsNft.tokenURI(0)}`)

    // const highValue = ethers.utils.parseEther("4000")
    // const dynamicSvgNft = await ethers.getContract("DynamicSvgNft", deployer)
    // const dynamicSvgNftMintTx = await dynamicSvgNft.mintNft(highValue.toString())
    // await dynamicSvgNftMintTx.wait(1)
    // console.log(`Dynamic SVG NFT index 0 tokenURI: ${await dynamicSvgNft.tokenURI(0)}`)

    // const highValue = ethers.utils.parseEther("4000")
    // const dynamicSvgNft = await ethers.getContract("DynamicSvgNft", deployer)
    // const dynamicSvgNftMintTx = await dynamicSvgNft.mintNft(highValue)
    // await dynamicSvgNftMintTx.wait(1)
    // console.log(`Dynamic SVG NFT index 0 tokenURI: ${await dynamicSvgNft.tokenURI(0)}`)
}

module.exports.tags = ["all", "mint"]
