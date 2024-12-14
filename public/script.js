const socket = io();

// Track user's geolocation
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            console.log('Sending location:', latitude, longitude);
            socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
            console.log("Geolocation error:", error);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 2000,
        }
    );
}

// Initialize the map
let map = L.map("map").setView([0, 0], 6);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "OpenStreetMap"
}).addTo(map);

const markers = {};

// Handle location updates from server
socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    
    if (!markers[id]) {
        // Create a new marker for the user
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    } else {
        // Update the existing marker's position
        markers[id].setLatLng([latitude, longitude]);
    }

    // Center the map on the new position
    map.setView([latitude, longitude], 16); // 16 is the zoom level
});

// Handle user disconnection
socket.on("user-disc", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);  // Remove marker from map
        delete markers[id];  // Delete marker from the markers object
    }
});
