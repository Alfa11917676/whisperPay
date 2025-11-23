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

    const dealer = await Dealer.attach("0x3c445CDc76e7feE6b4185826ff9790e8473c27C4");

    // let tx = await dealer.depositAndExec(
    //     "this is the dealer",
    //     1234,
    //     ethers.parseEther("0.001"),
    //     {
    //         value: ethers.parseEther("0.001")
    //     }
    // )
    // await tx.wait()
    // console.log("Tx done");

    console.log(await dealer.getJobDetails("0xB6688008F58FCfA1470278E570C315BB9bA46021"));


}


deployment()
