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

    const dealer = await Dealer.attach("0x59C899f52F2c40cBE5090bbc9A4f830B64a20Fc4");

    let tx = await dealer.depositAndExec(
        "this is the dealer",
        1234,
        ethers.parseEther("0.001"),
        {
            value: ethers.parseEther("0.001")
        }
    )
    await tx.wait()
    console.log("Tx done");


}


deployment()
