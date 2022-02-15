import React from 'react';
import { Map, MapMarker, MapProps } from 'react-kakao-maps-sdk';
import { css } from '@emotion/react';
import BounceLoader from 'react-spinners/BounceLoader';

type Center = MapProps['center'];

function App() {
  const [center, setCenter] = React.useState<Center | null>(null);

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

  const loadingCss = css`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  `;

  return (
    <>
      {center && (
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
      )}
      {!center && (
        <BounceLoader color="#fae100" loading css={loadingCss} size={150} />
      )}
    </>
  );
}

export default App;
