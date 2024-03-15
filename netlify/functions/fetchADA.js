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
    const apiKey = process.env.ADA_API_KEY;

    const url = `https://cardano-mainnet.blockfrost.io/api/v0/addresses/${walletAddress}`;

    const options = {
        method: 'GET',
        headers: { 
            'project_id': apiKey,
        },
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Error fetching address details: ${data.error_message ? data.error_message : "Unknown error"}`);
        }

        
        const adaBalanceObj = data.amount.find(asset => asset.unit === "lovelace");
        const balanceInLovelace = adaBalanceObj ? adaBalanceObj.quantity : "0";
        const balanceInAda = (parseInt(balanceInLovelace) / 1_000_000).toFixed(6);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ balance: balanceInAda + " ADA" }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: `Failed to fetch address details: ${error.message}` }),
        };
    }
};
