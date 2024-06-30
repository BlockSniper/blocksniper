const Web3 = require('web3');

exports.handler = async (event) => {
    // CORS headers
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    };

    // Handle OPTIONS request for CORS preflight
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers,
            body: "",
        };
    }

    const { walletAddress } = JSON.parse(event.body);
    const apiKey = process.env.ETH_API_KEY;
    const url = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}`;

    try {
        // For Ethereum, using the eth_getBalance method
        const requestBody = {
            jsonrpc: "2.0",
            method: "eth_getBalance",
            params: [walletAddress, "latest"],
            id: 1,
        };

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (!response.ok || data.error) {
            throw new Error(`Failed to fetch balance. ${data.error ? data.error.message : ""}`);
        }

        // Convert the balance from Wei to Ether
        const balanceInEther = Web3.utils.fromWei(data.result, 'ether');
        const formattedBalance = parseFloat(balanceInEther).toFixed(4);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ balance: formattedBalance }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: `Failed to fetch balance: ${error.message}` }),
        };
    }
};
