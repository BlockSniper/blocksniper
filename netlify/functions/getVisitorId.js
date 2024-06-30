// getVisitorId.js
const { v4: uuidv4 } = require('uuid');

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Content-Type": "application/json",
  "Set-Cookie": ""
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
    let visitorId = getCookie(event.headers.cookie, 'visitor_id');
    if (!visitorId) {
      visitorId = uuidv4();
      corsHeaders["Set-Cookie"] = `visitor_id=${visitorId}; Path=/; HttpOnly; Secure; Max-Age=${365 * 24 * 60 * 60}`;
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ visitorId }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Error generating visitor ID" }),
    };
  }
};

function getCookie(cookieString, name) {
  if (!cookieString) return null;
  const cookies = cookieString.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.split('=').map(c => c.trim());
    acc[key] = value;
    return acc;
  }, {});
  return cookies[name] || null;
}
