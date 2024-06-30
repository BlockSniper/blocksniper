// getVisitorId.js

const cookie = require('cookie');

exports.handler = async (event, context) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ""
    };
  }

  try {
    let visitorId = null;
    const cookies = event.headers.cookie ? cookie.parse(event.headers.cookie) : {};

    if (cookies.visitor_id) {
      visitorId = cookies.visitor_id;
    } else {
      visitorId = generateUUID();
    }

    const setCookieHeader = cookie.serialize('visitor_id', visitorId, {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      httpOnly: true,
      secure: true,
      sameSite: 'None'
    });

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Set-Cookie': setCookieHeader
      },
      body: JSON.stringify({ visitorId })
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
