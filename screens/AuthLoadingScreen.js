import React from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import config from "../constants/environment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { ShowVersion } from "./HomeScreen";

const AuthLoadingScreen = ({ ...props }) => {
  const { navigate, setOptions } = useNavigation();

  React.useEffect(() => {
    setOptions({ headerShown: false });
    AsyncStorage.multiGet(["token", "cleanerid"]).then((result) => {
      const userToken = result[0][1];
      const cleanerId = result[1][1];

      if (!userToken || !cleanerId) {
        navigate("Login");
        return;
      }
      let url = `${config().apiUrl}/api/upload-app-version?version=${config().version} (${Platform.OS})`;
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          token: userToken,
        },
      }).then(() => {
        url = `${config().apiUrl}/api/token?token=${userToken}`;
        fetch(url)
          .then((response) => response.json())
          .then((responseJson) => {
            navigate(responseJson.success ? "Home" : "Login");
          })
          .catch((error) => {
            console.error(error);
          });
      });
    });
  }, []);

  return (
    <ImageBackground
      source={require("../assets/images/login-background.jpg")}
      style={{
        flex: 1,
        height: "100%",
      }}
    >
      <View style={styles.content}>
        <ActivityIndicator size="large" color="white" />
        <StatusBar barStyle="default" />
        <ShowVersion style={{ color: "white", marginTop: 10 }} />
      </View>
    </ImageBackground>
  );
};

export default AuthLoadingScreen;
const styles = StyleSheet.create({
  content: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});
