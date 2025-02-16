import React from "react";
import * as Location from "expo-location";
import * as geolib from "geolib";
import { DropdownAlertType } from "react-native-dropdownalert";

const useLocation = () => {
  const [location, setLocation] = React.useState(null);
  const [error, setError] = React.useState(null);
  const isAskingForLocationRef = React.useRef(false);

  const updateLocation = React.useCallback(() => {
    Location.requestForegroundPermissionsAsync().then((response) => {
      if (response.status !== "granted") {
        setError("Permission to access location was denied");
      }
      if (isAskingForLocationRef.current === true) return;
      console.log("ASKING FOR LOCATION");
      isAskingForLocationRef.current = true;
      Location.getCurrentPositionAsync({}).then((position) => {
        setLocation(position);
        isAskingForLocationRef.current = false;
      });
    });
  }, []);

  React.useEffect(() => {
    updateLocation();
  }, []);

  const getDistance = React.useCallback(
    (coords) => {
      if (!location || !coords || (coords.lat === 0 && coords.lon === 0))
        return null;
      return geolib.convertDistance(
        geolib.getDistance(
          { latitude: coords.lat, longitude: coords.lon },
          {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        ),
        "km",
      );
    },
    [location],
  );

  React.useEffect(() => {
    if (error) {
      alert?.({
        type: DropdownAlertType.Error,
        title: error,
        interval: 1000,
      });
    }
  }, [error]);

  return [location, getDistance, updateLocation];
};

export default useLocation;
