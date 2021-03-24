const CHAIN = "mainnet";
const SUPPORT_ERC20_TOKEN = {
    "mainnet": [
        {
            name: "WETH",
            address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
            decimals: 18,
        },
        {
            name: "ZORA",
            address: "0xd8e3fb3b08eba982f2754988d70d57edc0055ae6",
            decimals: 18,
        },
        {
            name: "DAI",
            address: "0x6b175474e89094c44da98b954eedeac495271d0f",
            decimals: 18,
        },
        {
            name: "USDT",
            address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
            decimals: 6,
        },
        {
            name: "USDC",
            address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            decimals: 6,
        },
        {
            name: "UNI",
            address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
            decimals: 18,
        },
    ],
    "rinkeby": [
        
    ]
}

export {
    CHAIN,
    SUPPORT_ERC20_TOKEN
};