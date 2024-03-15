const Web3 = require('web3');


exports.handler = async (event, context) => {
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
    const apiKey = process.env.BSC_API_KEY;
    const url = `https://api.bscscan.com/api?module=account&action=balance&address=${walletAddress}&apikey=${apiKey}`;
    
    try {
        const response = await fetch(url);
        const result = await response.json();

        if (result.status === "1") {
            const balance = Web3.utils.fromWei(result.result, 'ether');
            const formattedBalance = parseFloat(balance).toFixed(4);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ balance: formattedBalance }),
            };
        } else {
            throw new Error('Failed to fetch balance');
        }
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to fetch balance' }),
        };
    }
};