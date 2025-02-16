import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as Linking from "expo-linking";
import { Button } from "react-native-elements";
import { DropdownAlertType } from "react-native-dropdownalert";
import { useAlertContext } from "../components/AlertContext";
import { useNavigation } from "@react-navigation/native";
import { calcHeight, calcWidth } from "../utils/deviceResponsiveHelper";

const JobInformation = ({ route }) => {
  const navigation = useNavigation();

  const [placeLocation, setPlaceLocation] = React.useState(null);

  const { alert } = useAlertContext();

  const { job, initialDate } = route.params;

  React.useEffect(() => {
    if (job) {
      navigation.setOptions({ title: job.place.name, headerShown: true });
      Location.reverseGeocodeAsync({
        latitude: job.place.geoCoords.lat,
        longitude: job.place.geoCoords.lon,
      })
        .then((locationDetail) => {
          setPlaceLocation(locationDetail[0]);
        })
        .catch((error) => {
          alert({
            type: DropdownAlertType.Error,
            message: "Could not retrieve location",
          });
        });
    }
  }, [job]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: job.place.geoCoords.lat,
            longitude: job.place.geoCoords.lon,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          showsUserLocation={true}
        >
          <Marker
            coordinate={{
              latitude: job.place.geoCoords.lat,
              longitude: job.place.geoCoords.lon,
            }}
            title={job.place.customer.name}
            description={job.place.name}
          />
        </MapView>
        <View style={{ flex: 1, position: "relative", height: "70%" }}>
          <View style={styles.buttonOpenMap}>
            <Button
              title="Open with maps"
              type="solid"
              onPress={() => {
                const url = `https://www.google.com/maps/search/?api=1&query=${job.place.geoCoords.lat}%2C${job.place.geoCoords.lon}`;
                Linking.openURL(url).catch((e) => {
                  console.error(e);
                });
              }}
            />
          </View>
          <View>
            <View>
              <Text style={styles.textTitle}>location address</Text>
              {placeLocation && (
                <Text style={styles.textData}>
                  {`${placeLocation.streetNumber} ${placeLocation.street}, \n${placeLocation.postalCode} ${placeLocation.city}`}
                </Text>
              )}
            </View>
            <Divider />
            <Text style={styles.textTitle}>Customer</Text>
            <Text style={styles.textData}>{job.place.customer.name}</Text>
            <Divider />
            <Text style={styles.textTitle}>Location name</Text>
            <Text style={styles.textData}>{job.place.name}</Text>
            <Divider />
            {!job.done && (
              <View style={styles.buttonOpenMap}>
                <Button
                  title="Complete tasks"
                  type="solid"
                  onPress={() =>
                    navigation.navigate("Tasks", {
                      tasks: job.template.tasks,
                      job: { ...job, initialDate },
                    })
                  }
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default JobInformation;

var styles = StyleSheet.create({
  textTitle: {
    fontSize: 16,
    color: "#ada8a3",
    paddingTop: "2%",
    paddingLeft: "3%",
    paddingRight: "3%",
  },
  textData: {
    fontSize: 16,
    paddingLeft: "3%",
    paddingRight: "5%",
  },
  textAddress: {
    width: "100%",
    height: calcWidth(3),
    paddingLeft: "2%",
  },
  buttonOpenMap: {
    paddingTop: calcWidth(1),
    marginLeft: "3%",
    marginRight: "3%",
  },
  container: {
    flex: 1,
  },
  map: {
    alignItems: "center",
    overflow: "hidden",
    alignSelf: "center",
    borderRadius: 8,
    shadowOpacity: 0.4,
    elevation: 1.5,
    marginTop: 5,
    marginBottom: 5,
    shadowRadius: 1,
    shadowOffset: { height: 2, width: 0 },
    height: calcHeight(35),
    width: calcWidth(95),
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

const Divider = () => {
  return (
    <View style={{ margin: "3%" }}>
      <View
        style={{
          borderBottomColor: "#4158d6",
          borderBottomWidth: 1,
        }}
      />
    </View>
  );
};
