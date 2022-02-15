import React from 'react';
import { Map, MapMarker, MapProps } from 'react-kakao-maps-sdk';
import { css } from '@emotion/react';
import { Button } from '@chakra-ui/react';
import BounceLoader from 'react-spinners/BounceLoader';

interface Point {
  lat: number;
  lng: number;
}

const loadingCss = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

function App() {
  const mapRef = React.useRef<kakao.maps.Map>();
  const [center, setCenter] = React.useState<Point | null>(null);
  const [targetPoint, setTargetPoint] = React.useState<Point | null>(null);
  const [level, setLevel] = React.useState<number>(3);

  const bounds = React.useMemo(() => {
    const bounds = new kakao.maps.LatLngBounds();
    if (center) {
      bounds.extend(new kakao.maps.LatLng(center.lat, center.lng));
    }
    if (targetPoint) {
      bounds.extend(new kakao.maps.LatLng(targetPoint.lat, targetPoint.lng));
    }
    return bounds;
  }, [center, targetPoint]);

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

  const handleChangeZoom = (map: kakao.maps.Map) => {
    setLevel(map.getLevel());
  };

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
          onCreate={(map: kakao.maps.Map) => (mapRef.current = map)}
          onClick={(_map, event) => {
            const lat = event.latLng?.getLat();
            const lng = event.latLng?.getLng();
            if (lat && lng) {
              setTargetPoint({ lat, lng });
            }
          }}
          onZoomChanged={handleChangeZoom}
          maxLevel={12}
          zoomable={true}
          draggable={true}
        >
          <MapMarker position={center}>
            <div style={{ color: '#000' }}>I 'm here</div>
          </MapMarker>
          {targetPoint && (
            <MapMarker position={targetPoint}>
              <div style={{ color: '#000' }}>Target</div>
            </MapMarker>
          )}
        </Map>
      )}
      {targetPoint && (
        <Button
          position="fixed"
          colorScheme="yellow"
          w="200px"
          bottom="40px"
          left="0"
          right="0"
          margin="auto"
          onClick={() => {
            if (mapRef.current) {
              mapRef.current.setBounds(bounds);
            }
          }}
        >
          setBounds
        </Button>
      )}
      {!center && (
        <BounceLoader color="#fae100" loading css={loadingCss} size={150} />
      )}
    </>
  );
}

export default App;
