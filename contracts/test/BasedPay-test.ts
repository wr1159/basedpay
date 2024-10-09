import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import {
    BASE_SEPOLIA_V3_SWAP_ROUTER,
    BASE_SEPOLIA_WETH9,
    BASE_SEPOLIA_XSGD,
} from "../constant";

describe("BasedPay", () => {
    const setupFixture = async () => {
        await hre.network.provider.request({
            method: "hardhat_reset",
            params: [
                {
                    forking: {
                        jsonRpcUrl: "https://sepolia.base.org",
                        blockNumber: 16321818,
                    },
                },
            ],
        });

        const [owner, otherAccount] = await hre.ethers.getSigners();
        const basedPay = await hre.ethers.deployContract(
            "BasedPay",
            [BASE_SEPOLIA_V3_SWAP_ROUTER],
            owner
        );

        return {
            basedPay,
            basedPayAddress: await basedPay.getAddress(),
            deployer: owner,
            otherAccount: otherAccount,
            accounts: await hre.ethers.getSigners(),
        };
    };

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            const { basedPay, deployer } = await loadFixture(setupFixture);
            expect(await basedPay.owner()).to.equal(deployer.address);
        });
    });

    describe("Register", function () {
        it("Should allow anyone to register and add a mapping", async function () {
            const { basedPay, deployer } = await loadFixture(setupFixture);
            const uen = "123456789X";
            const addr = deployer.address;

            // Add a new mapping
            await basedPay.register(uen);

            // Check the stored address for the given UEN
            expect(await basedPay.getAddressFromUen(uen)).to.equal(addr);
        });
    });

    describe("Delete Mapping", function () {
        it("Should only allow the owner to delete a mapping", async function () {
            const { basedPay, otherAccount } = await loadFixture(setupFixture);
            const uen = "123456789X";
            const addr = otherAccount.address;

            // Add a new mapping
            await basedPay.register(uen);

            // Try to delete the mapping as a non-owner (this should fail)
            await expect(
                basedPay.connect(otherAccount).deleteMapping(uen)
            ).to.be.revertedWith("Ownable: caller is not the owner");

            // Delete the mapping as the owner
            await basedPay.deleteMapping(uen);

            // Check if the mapping was deleted (should return address(0))
            expect(await basedPay.getAddressFromUen(uen)).to.equal(
                hre.ethers.ZeroAddress
            );
        });
    });

    describe("Get Mapping", function () {
        it("Should return the correct address for a given UEN", async function () {
            const { basedPay, otherAccount } = await loadFixture(setupFixture);
            const uen = "987654321Y";
            const addr = otherAccount.address;

            // Add a new mapping
            await basedPay.connect(otherAccount).register(uen);

            // Retrieve and check the address for the given UEN
            expect(await basedPay.getAddressFromUen(uen)).to.equal(addr);
        });

        it("Should return address(0) for a non-existent UEN", async function () {
            const { basedPay } = await loadFixture(setupFixture);
            const uen = "nonexistentUEN";

            // Check that an unregistered UEN returns the zero address
            expect(await basedPay.getAddressFromUen(uen)).to.equal(
                hre.ethers.ZeroAddress
            );
        });
    });
    describe("Update Mapping", function () {
        it("Should allow only the owner to update a mapping", async function () {
            const { basedPay, deployer, otherAccount } = await loadFixture(
                setupFixture
            );
            const uen = "123456789X";
            const initialAddr = otherAccount.address;
            const updatedAddr = deployer.address; // Assume we want to update to owner's address

            // Add a new mapping
            await basedPay.connect(otherAccount).register(uen);

            expect(await basedPay.getAddressFromUen(uen)).to.equal(initialAddr);

            // Update the mapping as the owner
            await basedPay.updateMapping(uen, updatedAddr);

            // Check the updated address for the given UEN
            expect(await basedPay.getAddressFromUen(uen)).to.equal(updatedAddr);
        });

        it("Should revert if a non-owner tries to update a mapping", async function () {
            const { basedPay, deployer, otherAccount } = await loadFixture(
                setupFixture
            );
            const uen = "123456789X";
            const updatedAddr = deployer.address;

            // Add a new mapping
            await basedPay.register(uen);

            // Try to update the mapping as a non-owner (this should fail)
            await expect(
                basedPay.connect(otherAccount).updateMapping(uen, updatedAddr)
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });
    describe("Uniswap V3 Swap", function () {
        it("should swap when given correct parameters", async function () {
            const { basedPay, basedPayAddress, deployer } = await loadFixture(
                setupFixture
            );

            const inputTokenAddress = BASE_SEPOLIA_WETH9; // WETH
            const WETH9 = await hre.ethers.getContractAt(
                "WETH9",
                inputTokenAddress
            );
            const balance = await WETH9.balanceOf(deployer.address);

            const outputTokenAddress = BASE_SEPOLIA_XSGD; // XSGD
            const xsgd = await hre.ethers.getContractAt(
                "XSGD",
                outputTokenAddress
            );
            // Fix test
            const amountOut = 3000000; // Same for now just to see if it works
            const amountInMaximum = 3000000; // taken from balance of deployer
            await WETH9.approve(basedPayAddress, amountInMaximum);
            await basedPay.swapExactOutputSingle(
                inputTokenAddress,
                outputTokenAddress,
                amountOut,
                amountInMaximum
            );
        });
    });
});
