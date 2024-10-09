// scripts/deploy.ts
import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const BasedPay = await ethers.getContractFactory("BasedPay");
    const basedPay = await BasedPay.deploy();

    const address = await basedPay.getAddress();
    console.log("BasedPay deployed to:", address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
