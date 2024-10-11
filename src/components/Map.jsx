import { useNavigate } from "react-router-dom";
import {MapContainer, TileLayer,Marker, Popup , useMap, useMapEvents} from "react-leaflet";
import styles from "./Map.module.css";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useGeoLocation } from "../hooks/useGeoLocation";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Button from "./Button";

function Map() {
   
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([40, 40]);
  const [mapLat, mapLng] = useUrlPosition();

  // const[searchParam] = useSearchParams();

  // const mapLat = searchParam.get("lat");
  // const mapLng = searchParam.get("lng");

  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeoLocation();
  
 

  useEffect(
    function () {
      if (geolocationPosition)
        setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
    },
    [geolocationPosition]
  );
  return (
    <div className={styles.mapContainer}>
      {isLoadingPosition ? <Button position='type' onClick={getPosition}>{isLoadingPosition ? 'Loading...' : 'Use Your Position'}</Button> :  " "}
      {!geolocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "Loading..." : "Use your position"}
        </Button>
      )}

      <MapContainer
        center={mapPosition}
        // center={[mapLat,mapLng]}
        //this senter is not interactive when position changes , map pointer does not change , in leaflet library everything works with component so we have to make a component for this
        zoom={13}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat , city.position.lng]}
            key = {city.id}
          >
            <Popup>
              <span>{city.emoji}</span> <span>{city.cityName}</span>
            </Popup>
          </Marker>
         ))} 

          <ChangeCenter position={mapPosition} />
                <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({position})
{
  const map = useMap();
  // console.log(position)
  if (position  && !isNaN(position[0]) && !isNaN(position[1])) { //&& position.length === 2
    map.setView(position);
  } else {
    console.error("Invalid position:", position);
  }
  return null;
}

function DetectClick()
{
    const navigate = useNavigate();
    useMapEvents({
      click : (e)=>navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
    })

}

export default Map;