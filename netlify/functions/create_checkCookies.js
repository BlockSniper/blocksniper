async function getVisitorIdFromService() {
  try {
    const response = await fetch('https://blocksniper.netlify.app/.netlify/functions/getVisitorId', {
      method: 'GET',
      credentials: 'include' // Include cookies in the request
    });
    const data = await response.json();
    return data.visitorId;
  } catch (error) {
    console.error('Error fetching visitor ID:', error);
    return null;
  }
}

document.addEventListener('DOMContentLoaded', async function() {
  const visitorId = await getVisitorIdFromService();
  if (visitorId) {
    console.log('Visitor ID:', visitorId);
    // Use the visitor ID as needed in your application
  } else {
    console.error('Failed to retrieve visitor ID.');
  }
});