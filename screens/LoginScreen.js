import React, { useState } from "react";

import {
  StyleSheet,
  View,
  ImageBackground,
  Keyboard,
  Platform,
} from "react-native";
import { Button, Input } from "react-native-elements";
import config from "../constants/environment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const { navigate } = useNavigation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const storeItem = React.useCallback((token, cleanerId) => {
    return Promise.all([
      AsyncStorage.setItem("token", token),
      AsyncStorage.setItem("cleanerid", cleanerId),
    ]);
  }, []);

  const login = React.useCallback(() => {
    Keyboard.dismiss();
    setLoading(true);
    fetch(config().apiUrl + "/api/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success && responseJson.cleanerid >= 0) {
          storeItem(responseJson.token, JSON.stringify(responseJson.cleanerid))
            .then((value) => {
              setLoading(false);
              navigate("Home");
            })
            .catch((error) => {
              console.log("Promise is rejected with error: " + error);
            });
        } else {
          if (responseJson.cleanerid === -1) {
            setLoading(false);
            setError("You are not a cleaner");
          } else {
            setLoading(false);
            setError("Bad credentials");
          }
        }
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        setError("An error occurred");
      });
  }, [username, password]);

  return (
    <ImageBackground
      source={require("../assets/images/login-background.jpg")}
      style={{
        flex: 1,
      }}
    >
      <View style={styles.content}>
        <View style={styles.messageBox}>
          <View>
            <Input
              placeholder=" Username"
              shake={true}
              errorStyle={{ color: "red" }}
              onChangeText={(text) => setUsername(text)}
            />
            <Input
              secureTextEntry={true}
              placeholder=" Password"
              shake={true}
              onChangeText={(text) => setPassword(text)}
              errorStyle={{ color: "red" }}
              errorMessage={error}
            />
            <Button
              loading={loading}
              disabled={loading}
              buttonStyle={{
                backgroundColor: "#00d1b2",
                borderRadius: 10,
                marginTop: "3%",
              }}
              textStyle={{ textAlign: "center" }}
              title={`Login`}
              onPress={login}
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "transparent",
    justifyContent: "center",
  },
  content: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  messageBox: {
    backgroundColor: "white",
    width: 300,
    paddingTop: 10,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 10,
  },
});
