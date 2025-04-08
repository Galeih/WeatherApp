// src/MapSelector.jsx
import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import customMarkerIcon from "./assets/marker-icon.png";

const customIcon = L.icon({
  iconUrl: customMarkerIcon,
  iconSize: [32, 32],
  iconAnchor: [12, 41],
});

// Composant pour détecter les clics sur la carte
function MapClickHandler({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
}

// Composant Recenter
function RecenterView({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView([position.lat, position.lng], map.getZoom());
    }
  }, [position, map]);
  return null;
}

function DraggableMarker({ position, onDragEnd }) {
  // Si vous voulez rendre le marqueur draggable, déclarez eventHandlers etc.
  const eventHandlers = {
    dragend(e) {
      const marker = e.target;
      const newPos = marker.getLatLng();
      onDragEnd(newPos);
    },
  };

  return (
    <Marker
      position={[position.lat, position.lng]}
      icon={customIcon}
      // draggable
      // eventHandlers={eventHandlers}
    >
    </Marker>
  );
}

function MapSelector({ position, onSelect, onDragEnd }) {
  const defaultCenter = [48.8566, 2.3522];
  const mapCenter = position ? [position.lat, position.lng] : defaultCenter;

  return (
    <MapContainer
      center={mapCenter}
      zoom={6}
      className="h-64 w-full rounded-lg shadow-md"
      scrollWheelZoom
    >
<TileLayer
  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>
      <MapClickHandler onSelect={onSelect} />
      <RecenterView position={position} />
      {position && (
        <DraggableMarker
          position={position}
          onDragEnd={(newPos) => onDragEnd && onDragEnd(newPos)}
        />
      )}
    </MapContainer>
  );
}

export default MapSelector;
