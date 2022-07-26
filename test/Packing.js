const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Packing", async function () {
    let Packing;
    let packing;

    beforeEach(async function () {
        Packing = await ethers.getContractFactory("PackingMock");
        packing = await Packing.deploy();
    });

    it("should pack address and uint96", async function () {
        const address = "0xaa000000000000000000000000000000000000bb";
        const uint96 = "0xcc00000000000000000000dd";

        const result = await packing.addressUint96(address, uint96);
        expect(result).to.equal("0x" + address.substring(2) + uint96.substring(2));
    });
});
