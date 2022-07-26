const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Light", async function () {
    const NAME = "Light";
    const SYMBOL = "L";
    const UNREVEALED_TOKEN_URI = "urn:unrevealed";
    const ROYALTY_AMOUNT = 700; // basis points
    const ROYALTY_DENOMINATOR = 10000; // basis points
    let Light;
    let light;
    let ceo, cfo, coo, buyer;

    before(async function () {
        [ceo, cfo, coo, buyer] = await ethers.getSigners();
    });

    describe("setting up contract", async function () {
        beforeEach(async function () {
            Light = await (await ethers.getContractFactory("Light")).connect(ceo);
            light = await Light.deploy(NAME, SYMBOL, UNREVEALED_TOKEN_URI, cfo.address, ROYALTY_AMOUNT);
            await light.connect(ceo).setOperatingOfficer(coo.address);
        });

        it("should have correct ERC-721 name", async function () {
            expect(await light.name()).to.equal(NAME);
        });

        it("should have correct ERC-721 symbol", async function () {
            expect(await light.symbol()).to.equal(SYMBOL);
        });

        it("should have correct general unrevealed token URI", async function () {
            expect(await light.unrevealedTokenURI()).to.equal(UNREVEALED_TOKEN_URI);
        });

        it("should have royalty amount set", async function () {
            const someTokenID = 17;
            [address, amount] = await light.royaltyInfo(someTokenID, ROYALTY_DENOMINATOR);
            expect(address).to.equal(cfo.address);
            expect(amount).to.equal(ROYALTY_AMOUNT);
        });

        it("should support ERC-721, ERC-165 and ERC-2981 interfaces", async function () {
            const expectedInterfaces = [
                "0x01ffc9a7", // ERC-165
                "0x80ac58cd", // ERC-721
                "0x2a55205a", // ERC-2981
            ];
            for (const iface of expectedInterfaces) {
                expect(await light.supportsInterface(iface)).to.be.true;
            }
        });
    });

    describe("contract administration", async function () {
        beforeEach(async function () {
            Light = await (await ethers.getContractFactory("Light")).connect(ceo);
            light = await Light.deploy(NAME, SYMBOL, UNREVEALED_TOKEN_URI, cfo.address, ROYALTY_AMOUNT);
            await light.connect(ceo).setOperatingOfficer(coo.address);
        });

        it("should allow admin to change royalty amount", async function () {
            const newRoyaltyAmount = 9000;
            await light.connect(coo).setRoyaltyAmount(newRoyaltyAmount);
            const [address, amount] = await light.royaltyInfo(0, ROYALTY_DENOMINATOR);
            expect(address).to.equal(cfo.address);
            expect(amount).to.equal(newRoyaltyAmount);
        });

        it("should not allow non-admin to change royalty amount", async function () {
            const newRoyaltyAmount = 9000;
            await expect(light.connect(buyer).setRoyaltyAmount(newRoyaltyAmount)).to.be.reverted;
        });

        it("should allow admin to set unrevealed token URI", async function () {
            const newUnrevealedTokenURI = "urn:new-unrevealed";
            await light.connect(coo).setUnrevealedTokenURI(newUnrevealedTokenURI);
            expect(await light.unrevealedTokenURI()).to.equal(newUnrevealedTokenURI);
        });

        it("should not allow non-admin to set unrevealed token URI", async function () {
            const newUnrevealedTokenURI = "urn:new-unrevealed";
            await expect(light.connect(buyer).setUnrevealedTokenURI(newUnrevealedTokenURI)).to.be.reverted;
        });
    });

    describe("using a non-random drop", async function () {
        const dropID = 1;
        const quantityForSale = 5;
        const tokenURIBase = "urn:drop19/";
        const emptyPasswordHash = "0x0000000000000000000000000000000000000000000000000000000000000000";

        beforeEach(async function () {
            Light = await (await ethers.getContractFactory("Light")).connect(ceo);
            light = await Light.deploy(NAME, SYMBOL, UNREVEALED_TOKEN_URI, cfo.address, ROYALTY_AMOUNT);
            await light.connect(ceo).setOperatingOfficer(coo.address);
            light.connect(coo).prepareDrop(dropID, quantityForSale, tokenURIBase, emptyPasswordHash);
        });

        it("should allow admin to abort drop", async function () {
            await light.connect(coo).abortDrop(dropID);
        });

        it("should not allow non-admin to abort drop", async function () {
            await expect(light.connect(buyer).abortDrop(dropID)).to.be.reverted;
        });

        describe("inside a public drop phase", async function () {
            const ethPrice = ethers.utils.parseEther("1", "ether");

            beforeEach(async function () {
                const startTime = "0x01"; // in the past
                const accessListRoot = "0x0000000000000000000000000000000000000000000000000000000000000000";
                await light.connect(coo).setDropPhases(dropID, [[startTime, ethPrice, accessListRoot]]);
            });

            it("should allow buyer to mint some", async function () {
                const tokenIDsInDrop = [1, 2, 3];
                const totalEther = ethPrice.mul(tokenIDsInDrop.length);
                const accessListProof = [];
                const accessListQuantity = 0;
                const tx = await light.connect(buyer).mintChosen(dropID, tokenIDsInDrop, accessListProof, accessListQuantity, { value: totalEther });
                const receipt = await tx.wait();

                // Parse logs
                expect(receipt.logs.length).to.equal(tokenIDsInDrop.length);
                //TODO: more rigorous testing of logs
            });

            it("should fail to sell same token twice", async function () {
                const tokenIDsInDrop = [1, 2, 3];
                const totalEther = ethPrice.mul(tokenIDsInDrop.length);
                const accessListProof = [];
                const accessListQuantity = 0;
                await light.connect(buyer).mintChosen(dropID, tokenIDsInDrop, accessListProof, accessListQuantity, { value: totalEther });

                await expect(light.connect(buyer).mintChosen(dropID, tokenIDsInDrop, accessListProof, accessListQuantity, { value: totalEther })).to.be.reverted;
            });

            it("should fail with insufficient Ether", async function () {
                const tokenIDsInDrop = [1, 2, 3];
                const missingEther = 1;
                const totalEther = ethPrice.mul(tokenIDsInDrop.length).sub(missingEther);
                const accessListProof = [];
                const accessListQuantity = 0;
                await expect(light.connect(buyer).mintChosen(dropID, tokenIDsInDrop, accessListProof, accessListQuantity, { value: totalEther })).to.be.reverted;
            });

            it("should fail with mintChosen outside the range 0..<number of tokens", async function () {
                const tokenIDsInDrop = [quantityForSale + 1];
                const totalEther = ethPrice.mul(tokenIDsInDrop.length);
                const accessListProof = [];
                const accessListQuantity = 0;
                await expect(light.connect(buyer).mintChosen(dropID, tokenIDsInDrop, accessListProof, accessListQuantity, { value: totalEther })).to.be.reverted;
            });
            
            it("should not allow abort drop after sales", async function () {
                const tokenIDsInDrop = [1, 2, 3];
                const totalEther = ethPrice.mul(tokenIDsInDrop.length);
                const accessListProof = [];
                const accessListQuantity = 0;
                await light.connect(buyer).mintChosen(dropID, tokenIDsInDrop, accessListProof, accessListQuantity, { value: totalEther });

                await expect(light.connect(coo).abortDrop(dropID)).to.be.reverted;
            });

            it("should not allow using random minting", async function () {
                const quantityToMint = 10;
                const totalEther = ethPrice.mul(quantityToMint);
                const accessListProof = [];
                const accessListQuantity = 0;
                await expect(light.connect(buyer).mintRandom(dropID, quantityToMint, accessListProof, accessListQuantity, { value: totalEther })).to.be.reverted;
            });
        });

        describe("inside a private drop phase", async function () {
            it("should allowed allow buyer to mint some");

            it("should fail to mint for not allowed buyer");
        });

        describe("after sold out", async function () {
            const ethPrice = ethers.utils.parseEther("1", "ether");
            const tokenIDsInDrop = [...Array(quantityForSale).keys()];

            beforeEach(async function () {
                const startTime = "0x01"; // in the past
                const accessListRoot = "0x0000000000000000000000000000000000000000000000000000000000000000";
                await light.connect(coo).setDropPhases(dropID, [[startTime, ethPrice, accessListRoot]]);
                const accessListProof = [];
                const accessListQuantity = 0;
                const totalEther = ethPrice.mul(tokenIDsInDrop.length);
                await light.connect(buyer).mintChosen(dropID, tokenIDsInDrop, accessListProof, accessListQuantity, { value: totalEther });
            });

            it("should allow anyone to freeze token metadata", async function () {
                const quantityToFreeze = quantityForSale - 1;
                const firstTokenID = 1000000; // TODO: use a mock to calculate this properly
                await light.connect(buyer).freezeMetadataForDrop(dropID, quantityToFreeze);
                await light.connect(buyer).freezeMetadataForDrop(dropID, quantityToFreeze);
                expect(await light.tokenURI(firstTokenID)).to.equal(tokenURIBase + tokenIDsInDrop[0]);
            });
        });
    });

    describe("using a random drop", async function () {
        beforeEach(async function () {
            Light = await (await ethers.getContractFactory("Light")).connect(ceo);
            light = await Light.deploy(NAME, SYMBOL, UNREVEALED_TOKEN_URI, cfo.address, ROYALTY_AMOUNT);
            await light.connect(ceo).setOperatingOfficer(coo.address);
        });

        it("should allow admin to abort drop");

        it("should not allow non-admin to abort drop");

        it("should not allow chosen minting");

        it("should sell with correct Ether amount");
        // include paying and getting the token

        it("should fail with incorrect Ether amount");

        it("should not allow same token to be sold twice");

        it("should use general unrevealed token URI, if specific not set");

        it("should use specific unrevealed token URI if set");

        it("should allow admin to finalize drop with password");

        it("should allow admin to finalize drop without password (WITH SHAME)");

        it("should not allow non-admin to finalize drop with password");

        it("should not allow non-admin to finalize drop without password");

        it("should not allow admin to finalize drop until sold out");

        it("should return the specific token URI after finalized");

        it("should allow anyone to freeze token metadata");
    });

    describe("finalizing a drop", async function () {
        beforeEach(async function () {
            Light = await (await ethers.getContractFactory("Light")).connect(ceo);
            light = await Light.deploy(NAME, SYMBOL, UNREVEALED_TOKEN_URI, cfo.address, ROYALTY_AMOUNT);
            await light.connect(ceo).setOperatingOfficer(coo.address);
        });

        if("should not allow non-admin to finalize drop");
    });

    describe("freezing metadata", async function () {
        beforeEach(async function () {
            Light = await (await ethers.getContractFactory("Light")).connect(ceo);
            light = await Light.deploy(NAME, SYMBOL, UNREVEALED_TOKEN_URI, cfo.address, ROYALTY_AMOUNT);
            await light.connect(ceo).setOperatingOfficer(coo.address);
        });

        it("should allow anyone to freeze metadata");

        it("should allow 100% of metadata to be frozen");
    });

    describe("using an allow list", async function () {
        beforeEach(async function () {
            Light = await (await ethers.getContractFactory("Light")).connect(ceo);
            light = await Light.deploy(NAME, SYMBOL, UNREVEALED_TOKEN_URI, cfo.address, ROYALTY_AMOUNT);
        });

        it("should allow authorized buyer to buy");

        it("should not allow unauthorized buyer to buy");
    });
});
