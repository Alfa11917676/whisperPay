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
    let dealer = await upgrades.deployProxy(
        Dealer,
        [admin.address]
    );
    await dealer.waitForDeployment();
    debug("Deployment successfully deployed", dealer.target)

    await saveContract({
        name: "Dealer",
        contractAddress: dealer.target,
        dependencies: {
        },
        deployer: admin.address
    })
}

async function saveContract({ name, contractAddress, dependencies, deployer }) {
    const output = {
        name: name,
        ContactAddress: contractAddress,
        dependencies: dependencies,
        deployer: deployer,
        date: new Date()
    }
    let deploymentString = JSON.stringify(output, null, 4)
    const namePath = name ? `${name}/` : ""

    // Define the directory path
    const dir = `deployment/${namePath}`

    // Create the directory if it does not exist, including any necessary parent directories
    await fs.mkdir(dir, { recursive: true })

    // Write the file
    await fs.writeFile(`${dir}${network.name}.${name}.json`, deploymentString)
}

deployment()
