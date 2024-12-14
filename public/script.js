const socket = io();
if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("send-location", { latitude, longitude })
    }, (error) => {
        console.log(error);
    },
    {
        enableHighAccuracy:true,
        maximumAge:0,
        timeout:5000,
    }
    );
}

let map = L.map("map").setView([0,0],6);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"OpenStreetMap"
}).addTo(map)



const markers = {};

socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    console.log("Received location for map:", latitude, longitude);
    if (!markers[id]) {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    } else {
        markers[id].setLatLng([latitude, longitude]);
    }
    map.setView([latitude, longitude], 16);
});
socket.on("user-disc",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})
