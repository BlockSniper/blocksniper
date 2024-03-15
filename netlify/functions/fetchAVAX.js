
const Web3 = require('web3');

exports.handler = async (event) => {
    const headers = {
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    };

    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers,
            body: "",
        };
    }

    const { walletAddress } = JSON.parse(event.body);
    const apiKey = process.env.AVAX_API_KEY;
    const url = `https://avalanche-mainnet.infura.io/v3/${apiKey}`;


    const payload = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            jsonrpc: "2.0",
            method: "eth_getBalance",
            params: [walletAddress, "latest"],
            id: 1
        }),
    };

    try {
        const response = await fetch(url, payload);
        const data = await response.json();

        if (!response.ok || data.error) {
            throw new Error(`Error fetching balance: ${data.error ? data.error.message : "Unknown error"}`);
        }


        const balanceInEther = Web3.utils.fromWei(data.result, 'ether');

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ balance: balanceInEther }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
