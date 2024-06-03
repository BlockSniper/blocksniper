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
        body: JSON.stringify({message: "session Connection Established"})
      };
    }
  
    try {
      // Retrieve the client's IP address from the headers provided by Netlify
      const ip = event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'];
  
      if (!ip) {
        // If the IP address is not found in the headers
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: "Session Error #xf094" })
        };
      }
  
      // Successfully return the IP address with CORS headers
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ ip })
      };
    } catch (error) {
      // Handle unexpected errors gracefully
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: "ASession Error #xf095" })
      };
    }
  };
  
