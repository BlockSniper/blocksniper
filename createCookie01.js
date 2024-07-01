
    let visitorId = null;

    function getOrCreateVisitorId() {
        const cookieName = "visitorId";
        const cookieValue = getCookie(cookieName);

        if (cookieValue) {
            return cookieValue;
        } else {
            const newVisitorId = generateUUID();
            setCookie(cookieName, newVisitorId, 365);
            return newVisitorId;
        }
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = `; expires=${date.toUTCString()}`;
        }
        document.cookie = `${name}=${value || ""}${expires}; path=/; domain=.yourdomain.com; Secure; SameSite=None`;
    }

    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0,
                  v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // Initialize the visitor ID on page load
    document.addEventListener("DOMContentLoaded", function() {
        visitorId = getOrCreateVisitorId();
    });

    // Ensure the visitorId is available globally
    const getVisitorId = () => visitorId;

