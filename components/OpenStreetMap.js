import React, {useRef, useState} from 'react'
import L from 'leaflet';
import {Marker, Popup, TileLayer} from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import {MapContainer} from "react-leaflet";
import {useRouter} from "next/router";
const OpenStreetMap = (data) => {
    const router = useRouter()
    const icon = L.icon({
        iconUrl: router.pathname + "/images/marker-icon.png",
        iconRetinaUrl: router.pathname + "/images/marker-icon-2x.png",
        shadowUrl: router.pathname + "/images/marker-shadow.png",
    });
    const [center, setCenter] = useState({lat: 51.9228, lng: 4.4891})
    const ZOOM_LEVEL = 12
    const mapRef = useRef()
    return (
        <MapContainer style={{width: '100%', height: 1000}} center={center} zoom={ZOOM_LEVEL} ref={mapRef}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            {data.data.woningen.map((location) => (
                <Marker
                    iconShadow={icon}
                    icon={icon}
                    key={location.id}
                    position={[location.latitude, location.longitude]}
                >
                    <Popup>
                        {location.id} <br/> Easily customizable.
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}

export default OpenStreetMap