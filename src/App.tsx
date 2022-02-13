import React from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

function App() {
  const [center, setCenter] = React.useState({
    lat: 33.5563,
    lng: 126.79581,
  });
  React.useEffect(() => {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
    const success = ({ coords }: { coords: GeolocationCoordinates }) => {
      console.log(`lat: ${coords.latitude}, long: ${coords.longitude}`);
      setCenter({
        lat: coords.latitude,
        lng: coords.longitude,
      });
    };
    const error = (error: GeolocationPositionError) => {
      console.warn(error);
    };
    navigator.geolocation.getCurrentPosition(success, error, options);
  }, []);
  return (
    <Map
      center={center}
      style={{
        position: 'fixed',
        inset: '0',
        margin: 'auto',
      }}
    >
      <MapMarker position={{ lat: 33.55635, lng: 126.795841 }}>
        <div style={{ color: '#000' }}>Hello World!</div>
      </MapMarker>
    </Map>
  );
}

export default App;
