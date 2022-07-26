require("@nomiclabs/hardhat-waffle");

module.exports = {
    solidity: {
        compilers: [
            {
                version: "0.8.15",
                settings: {
                    viaIR: true,
                    optimizer: {
                        enabled: true,
                        runs: 200,
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
    // specify separate cache for hardhat, since it could possibly conflict with foundry's
    paths: { cache: "hh-cache" },
};
