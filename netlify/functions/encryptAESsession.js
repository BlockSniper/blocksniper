

// Define CORS headers for responses
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Adjust according to your needs for production
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Content-Type": "application/json"
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204, // No Content
      headers: corsHeaders,
      body: ""
    };
  }

  try {
    // Call the ipify API to get the client's IP address
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();

    if (!data || !data.ip) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Session Error #xf094: IP address not found" })
      };
    }

    // Successfully return the IP address with CORS headers
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ ip: data.ip })
    };
  } catch (error) {
    console.error("Error:", error.message, error.stack);

    // Handle unexpected errors gracefully
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Session Error #xf095", details: error.message })
    };
  }
};
