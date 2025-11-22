const { ethers, upgrades, network } = require("hardhat")
const dotenv = require("dotenv")
const debug = require("debug")("whisperPay:deployment")
const fs = require("fs").promises
dotenv.config()

async function deployment() {
    debug("Deployment started")
    const [admin] = await ethers.getSigners()
    console.log("admin & networkName", admin.address, network.name)

    const Dealer = await ethers.getContractFactory("Dealer")
    let dealer = await upgrades.upgradeProxy(
        "0xcc5C140243fec99a8CB40905b7b7A842A10f4630",
        Dealer,
    );
    await dealer.waitForDeployment();
    debug("Deployment successfully deployed", dealer.target)

}


deployment()
