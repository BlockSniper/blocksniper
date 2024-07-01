const { parse, serialize } = require('cookie');

exports.handler = async (event) => {
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Credentials": "true",
        "Content-Type": "application/json"
    };

    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 204,
            headers: corsHeaders,
            body: ""
        };
    }

    const cookies = event.headers.cookie ? parse(event.headers.cookie) : {};
    let visitorId = cookies.visitorId;

    if (!visitorId) {
        visitorId = generateUUID();
        const serializedCookie = serialize('visitorId', visitorId, {
            httpOnly: true,
            secure: true,
            sameSite: 'Lax',
            maxAge: 365 * 24 * 60 * 60, // 1 year
            path: '/'
        });

        corsHeaders['Set-Cookie'] = serializedCookie;
    }

    const redirectUrl = event.queryStringParameters.redirect || 'https://your-main-site.com';
    return {
        statusCode: 302,
        headers: {
            ...corsHeaders,
            'Location': redirectUrl
        },
        body: ''
    };
};

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0,
              v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
