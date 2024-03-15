
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
    
    const apiKey = process.env.SOL_API_KEY;
    const { walletAddress } = JSON.parse(event.body);
    const url = `https://solana-mainnet.g.alchemy.com/v2/${apiKey}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "jsonrpc": "2.0",
                "id": 1,
                "method": "getBalance",
                "params": [walletAddress]
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        const balanceInLamports = data.result.value;
        const balanceInSOL = (balanceInLamports / 1e9).toFixed(4);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ balance: balanceInSOL })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};
