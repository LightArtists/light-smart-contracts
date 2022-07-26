require("@nomiclabs/hardhat-waffle");
require("solidity-coverage");

module.exports = {
    solidity: {
        compilers: [
            {
                version: "0.8.14",
                settings: {
                    viaIR: false,
                    optimizer: {
                        enabled: false,
                    },
                },
            },
        ],
    },
    networks: {
        hardhat: {
            blockGasLimit: 30000000,
            throwOnCallFailures: false,
        },
    },
    gasReporter: {
        enabled: process.env.REPORT_GAS !== undefined,
        currency: "USD",
    },
};
