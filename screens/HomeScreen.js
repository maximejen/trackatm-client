import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Updates from "expo-updates";
import * as ScreenOrientation from "expo-screen-orientation";
import LottieView from "lottie-react-native";
import { Icon } from "react-native-elements";
import config from "../constants/environment";
import { DropdownAlertType } from "react-native-dropdownalert";
import { OrientationLock } from "expo-screen-orientation/src/ScreenOrientation.types";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import HomePlanningList from "../components/HomePlanningList";
import { useAlertContext } from "../components/AlertContext";
import useLocation from "../hooks/useLocation";

export const ShowVersion = (props) => {
  return (
    <Text
      {...props}
      style={{
        marginLeft: "auto",
        marginRight: "auto",
        fontSize: 12,
        ...props.style,
      }}
    >
      {config().version}
    </Text>
  );
};

const HomeScreen = () => {
  const animationRef = React.useRef(null);
  const { navigate, setOptions, addListener } = useNavigation();

  const { alert } = useAlertContext();
  const [location, getDistance, updateLocation] = useLocation();

  React.useEffect(() => {
    const unsubscribe = addListener("focus", () => {
      updateLocation();
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const logout = React.useCallback(() => {
    alert?.({
      type: DropdownAlertType.Success,
      message: "Logout",
    });
    // try {
    //   return AsyncStorage.removeItem("token").then(() => {
    //     navigate("Login");
    //   });
    // } catch (error) {
    //   console.log(error.message);
    // }
  }, [navigate]);

  // set Header of the page
  React.useEffect(() => {
    setOptions({
      title: "List of jobs",
      headerShown: true,
      headerLeft: () => {
        return (
          <TouchableOpacity onPress={async () => await Updates.reloadAsync()}>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginRight: Platform.OS === "android" ? 10 : 0,
              }}
            >
              <Icon name="refresh-ccw" type="feather" />
            </View>
          </TouchableOpacity>
        );
      },
      headerRight: () => {
        return (
          <TouchableOpacity onPress={() => logout()}>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="log-out" type="feather" />
            </View>
          </TouchableOpacity>
        );
      },
    });
  }, []);

  React.useEffect(() => {
    loadPlanning();
    ScreenOrientation.lockAsync(OrientationLock.PORTRAIT_UP).then(() => {});
  }, []);

  const [planningResponse, setPlanningResponse] = React.useState(null);
  const [planning, setPlanning] = React.useState(null);

  const loadPlanning = React.useCallback(() => {
    AsyncStorage.getItem("token").then((token) => {
      fetch(`${config().apiUrl}/api/cleaner/operations/?flat=false`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          token,
        },
      })
        .then((response) => response.json())
        .then((responseJson) => {
          setPlanningResponse(responseJson);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }, []);

  React.useEffect(() => {
    if (planningResponse)
      setPlanning(JSON.parse(JSON.stringify(planningResponse)));
  }, [location, planningResponse]);

  React.useEffect(() => {
    if (location) console.log("GOT A LOCATION !", location);
  }, [location]);

  const hasJobs = React.useMemo(() => {
    return (
      planning && Object.keys(planning).some((day) => planning[day].length > 0)
    );
  }, [planning]);

  if (planning) {
    if (!hasJobs) {
      return (
        <View style={styles.textContainer}>
          <Text style={{ fontSize: 30 }}>You have no job</Text>
          <ShowVersion />
        </View>
      );
    }
    return (
      <HomePlanningList
        planning={planning}
        onRefresh={() => {
          loadPlanning();
        }}
        getDistance={getDistance}
      />
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <View style={styles.imageWrapper}>
        <LottieView
          ref={(animation) => {
            animationRef.current = animation;
          }}
          style={styles.animationWrapper}
          source={require("../assets/5340-line-loader")}
          loop
        />
      </View>
      <ShowVersion />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  gridView: {
    flex: 1,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    justifyContent: "flex-end",
    borderRadius: 20,
    padding: 10,
    height: 110,
  },
  itemName: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  itemCode: {
    fontWeight: "600",
    fontSize: 12,
    color: "#fff",
  },
  container: {
    flex: 1,
  },
  sectionHeaderImportant: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: "#ff220f",
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: "rgba(247,247,247,1.0)",
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  imageWrapper: {
    width: 170,
    height: 170,
    opacity: 0.85,
    justifyContent: "center",
  },
  loadingText: {
    width: "100%",
    textAlign: "center",
  },
  logoImage: {
    width: "100%",
    alignItems: "center",
  },
  animationWrapper: {
    width: "100%",
    height: "100%",
  },
});
