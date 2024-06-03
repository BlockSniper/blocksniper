// netlify/functions/get-ip.js

// Define CORS headers for responses
const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // Adjust according to your needs for production
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Content-Type": "application/json"
};

exports.handler = async (event) => {
    // Handle preflight OPTIONS request
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 204, // No Content
            headers: corsHeaders,
            body: ""
        };
    }

    try {
        // Log the event to debug issues with finding the IP address
        console.log("Event:", JSON.stringify(event));

        // Retrieve the client's IP address from the headers provided by Netlify
        const ip = event.headers['x-nf-client-connection-ip'] || 
                   event.headers['client-ip'] || 
                   event.headers['x-forwarded-for']?.split(',')[0];

        console.log("IP Address Retrieved:", ip);

        if (!ip) {
            // If the IP address is not found in the headers
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ error: "Session Error #xf094: IP address not found in headers" })
            };
        }

        // Successfully return the IP address with CORS headers
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ ip })
        };
    } catch (error) {
        // Log the error to help with debugging
        console.error("Error:", error.message, error.stack);

        // Handle unexpected errors gracefully
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: "Session Error #xf095", details: error.message })
        };
    }
};
