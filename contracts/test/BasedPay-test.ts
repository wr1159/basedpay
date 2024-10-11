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
        const weth9 = await hre.ethers.getContractAt(
            "WETH9",
            BASE_SEPOLIA_WETH9
        );
        const xsgd = await hre.ethers.getContractAt("XSGD", BASE_SEPOLIA_XSGD);

        return {
            basedPay,
            basedPayAddress: await basedPay.getAddress(),
            weth9,
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

    describe("Store Management", function () {
        it("Should allow anyone to register a store", async function () {
            const { basedPay, deployer } = await loadFixture(setupFixture);
            const uen = "123456789X";
            const storeName = "Test Store";

            await basedPay.registerStore(uen, storeName);

            const stores = await basedPay.getStores(deployer.address);
            expect(stores.length).to.equal(1);
            expect(stores[0].uen).to.equal(uen);
            expect(stores[0].name).to.equal(storeName);
        });

        it("Should allow store owner to delete their store", async function () {
            const { basedPay, deployer } = await loadFixture(setupFixture);
            const uen = "123456789X";
            const storeName = "Test Store";

            await basedPay.registerStore(uen, storeName);
            await basedPay.deleteStore(uen);

            const stores = await basedPay.getStores(deployer.address);
            expect(stores.length).to.equal(0);
        });

        it("Should allow store owner to update their store name", async function () {
            const { basedPay, deployer } = await loadFixture(setupFixture);
            const uen = "123456789X";
            const storeName = "Test Store";
            const newStoreName = "Updated Test Store";

            await basedPay.registerStore(uen, storeName);
            await basedPay.updateStore(uen, newStoreName);

            const stores = await basedPay.getStores(deployer.address);
            expect(stores[0].name).to.equal(newStoreName);
        });

        it("Should not allow non-owner to delete or update a store", async function () {
            const { basedPay, deployer, otherAccount } = await loadFixture(setupFixture);
            const uen = "123456789X";
            const storeName = "Test Store";

            await basedPay.registerStore(uen, storeName);

            await expect(basedPay.connect(otherAccount).deleteStore(uen))
                .to.be.revertedWith("Not authorized to delete this store");

            await expect(basedPay.connect(otherAccount).updateStore(uen, "New Name"))
                .to.be.revertedWith("Not authorized to update this store");
        });
    });

    describe("Get Address From UEN", function () {
        it("Should return the correct address for a given UEN", async function () {
            const { basedPay, deployer } = await loadFixture(setupFixture);
            const uen = "987654321Y";
            const storeName = "Test Store";

            await basedPay.registerStore(uen, storeName);

            expect(await basedPay.getAddressFromUen(uen)).to.equal(deployer.address);
        });

        it("Should return address(0) for a non-existent UEN", async function () {
            const { basedPay } = await loadFixture(setupFixture);
            const uen = "nonexistentUEN";

            expect(await basedPay.getAddressFromUen(uen)).to.equal(
                hre.ethers.ZeroAddress
            );
        });
    });

    describe("Swap & Pay function", function () {
        it("should swap when given different tokens", async function () {
            const { basedPay, basedPayAddress, otherAccount } =
                await loadFixture(setupFixture);
            const uen = "123456789X";
            const storeName = "Test Store";
            
            await basedPay.connect(otherAccount).registerStore(uen, storeName);

            const inputTokenAddress = BASE_SEPOLIA_WETH9; // WETH
            const weth9 = await hre.ethers.getContractAt(
                "WETH9",
                inputTokenAddress
            );

            const outputTokenAddress = BASE_SEPOLIA_XSGD; // XSGD
            const xsgd = await hre.ethers.getContractAt(
                "XSGD",
                outputTokenAddress
            );
            const balanceBeforeSwap = await xsgd.balanceOf(
                otherAccount.address
            );
            const amountOut = 3000000; // Same for now just to see if it works
            const amountInMaximum = 3000000; // taken from balance of deployer
            await weth9.approve(basedPayAddress, amountInMaximum);
            await basedPay.payMerchant(
                inputTokenAddress,
                outputTokenAddress,
                uen,
                amountOut,
                amountInMaximum
            );
            const balanceAfterSwap = await xsgd.balanceOf(otherAccount.address);
            expect(balanceAfterSwap).to.be.gt(balanceBeforeSwap);
        });

        it("should send when given same tokens", async function () {
            const { basedPay, basedPayAddress, weth9, otherAccount } =
                await loadFixture(setupFixture);
            const uen = "123456789X";
            const storeName = "Test Store";
            
            await basedPay.connect(otherAccount).registerStore(uen, storeName);

            const balanceBeforeSwap = await weth9.balanceOf(
                otherAccount.address
            );
            const amountOut = 2000000; // Same for now just to see if it works
            const amountInMaximum = 3000000; // taken from balance of deployer
            await weth9.approve(basedPayAddress, amountInMaximum);
            await basedPay.payMerchant(
                BASE_SEPOLIA_WETH9,
                BASE_SEPOLIA_WETH9,
                uen,
                amountOut,
                amountInMaximum
            );
            const balanceAfterSwap = await weth9.balanceOf(
                otherAccount.address
            );
            expect(balanceAfterSwap).to.be.gt(balanceBeforeSwap);
        });
    });
});